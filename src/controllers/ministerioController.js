// src/controllers/ministerioController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.criarMinisterio = async (req, res) => {
  try {
    const { nome, descricao, liderId } = req.body;
    if (!nome) return res.status(400).json({ mensagem: 'Nome é obrigatório.' });

    // verifica líder existe e tem papel compatível (opcional)
    if (liderId) {
      const lider = await prisma.usuario.findUnique({ where: { id: Number(liderId) } });
      if (!lider) return res.status(404).json({ mensagem: 'Líder não encontrado.' });
    }

    const m = await prisma.ministerio.create({
      data: { nome, descricao, liderId: liderId ? Number(liderId) : null },
    });
    return res.status(201).json(m);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao criar ministério.' });
  }
};

exports.editarMinisterio = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, descricao } = req.body;
    const atualizado = await prisma.ministerio.update({
      where: { id },
      data: { nome, descricao },
    });
    return res.json(atualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao editar ministério.' });
  }
};

// Atribuir líder (não permite atribuir se já houver líder; admin pode substituir se desejar)
exports.atribuirLider = async (req, res) => {
  try {
    const ministerioId = Number(req.params.id);
    // aceitar do body ou query
    const { liderId: bodyLiderId, force } = req.body || {};
    const queryLiderId = req.query?.liderId;
    const liderId = Number(bodyLiderId ?? queryLiderId);

    console.log('atribuirLider - params:', { ministerioId, liderId, force, usuario: req.usuario });

    if (!ministerioId || !liderId || Number.isNaN(liderId)) {
      return res.status(400).json({ mensagem: 'ministerioId e liderId são obrigatórios no body ou query.' });
    }

    const lider = await prisma.usuario.findUnique({ where: { id: Number(liderId) } });
    if (!lider) return res.status(404).json({ mensagem: 'Usuário (líder) não encontrado.' });

    const outroMinisterio = await prisma.ministerio.findFirst({ where: { liderId: Number(liderId) } });
    if (outroMinisterio && outroMinisterio.id !== ministerioId && !force) {
      return res.status(400).json({ mensagem: 'Usuário já lidera outro ministério. Use force=true para transferir.' });
    }

    const ministerio = await prisma.ministerio.findUnique({ where: { id: ministerioId } });
    if (!ministerio) return res.status(404).json({ mensagem: 'Ministério não encontrado.' });

    if (ministerio.liderId && ministerio.liderId !== Number(liderId) && !force) {
      return res.status(400).json({ mensagem: 'Ministério já possui um líder. Use force=true para substituir.' });
    }

    const atualizado = await prisma.ministerio.update({
      where: { id: ministerioId },
      data: { liderId: Number(liderId) },
    });

    console.log('atribuirLider - sucesso:', atualizado);
    return res.status(200).json(atualizado);
  } catch (error) {
    console.error('atribuirLider - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao atribuir líder.', detalhe: error.message });
  }
};

exports.adicionarVoluntario = async (req, res) => {
  try {
    const ministerioId = Number(req.params.id);
    const voluntarioId = Number(req.body?.voluntarioId ?? req.query?.voluntarioId);
    console.log('adicionarVoluntario called', { ministerioId, voluntarioId, usuario: req.usuario });

    if (!ministerioId || !voluntarioId || Number.isNaN(ministerioId) || Number.isNaN(voluntarioId)) {
      return res.status(400).json({ mensagem: 'ministerioId (params) e voluntarioId (body ou query) são obrigatórios e numéricos.' });
    }

    // verificar existência
    const [usuario, ministerio] = await Promise.all([
      prisma.usuario.findUnique({ where: { id: voluntarioId } }),
      prisma.ministerio.findUnique({ where: { id: ministerioId } })
    ]);
    if (!usuario) return res.status(404).json({ mensagem: 'Voluntário não encontrado.' });
    if (!ministerio) return res.status(404).json({ mensagem: 'Ministério não encontrado.' });

    // contar ministérios APROVADOS do usuário (fallback se não existir campo status)
    let totalAprovados = 0;
    try {
      totalAprovados = await prisma.usuarioMinisterio.count({ where: { usuarioId: voluntarioId, status: 'APROVADO' } });
    } catch (e) {
      totalAprovados = await prisma.usuarioMinisterio.count({ where: { usuarioId: voluntarioId } });
    }
    if (totalAprovados >= 2) return res.status(400).json({ mensagem: 'Voluntário já participa de 2 ministérios aprovados.' });

    // cria ou atualiza vínculo
    const existente = await prisma.usuarioMinisterio.findFirst({ where: { usuarioId: voluntarioId, ministerioId } });
    if (existente) {
      if ('status' in existente) {
        const atualizado = await prisma.usuarioMinisterio.update({ where: { id: existente.id }, data: { status: 'APROVADO' } });
        return res.status(200).json(atualizado);
      }
      return res.status(200).json({ mensagem: 'Vínculo já existe.' });
    }

    const criado = await prisma.usuarioMinisterio.create({
      data: { usuarioId: voluntarioId, ministerioId, status: 'APROVADO' } // Prisma ignora campo se não existir no schema
    });
    return res.status(201).json(criado);
  } catch (error) {
    console.error('adicionarVoluntario - erro:', error);
    if (error.code === 'P2003') return res.status(404).json({ mensagem: 'FK violation: usuário ou ministério não existe.' });
    if (error.code === 'P2002') return res.status(200).json({ mensagem: 'Vínculo já existe (unicidade).' });
    return res.status(500).json({ mensagem: 'Erro ao adicionar voluntário.', detalhe: error.message });
  }
};

// Remover ministério — bloqueia se houver escalas ativas (dataHora >= agora)
exports.removerMinisterio = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) return res.status(400).json({ mensagem: 'ID do ministério obrigatório.' });

    const now = new Date();
    const escalasAtivas = await prisma.escala.count({
      where: { ministerioId: id, dataHora: { gte: now } }
    });
    if (escalasAtivas > 0) {
      return res.status(400).json({ mensagem: 'Não é possível excluir: existem escalas ativas vinculadas ao ministério.' });
    }

    await prisma.usuarioMinisterio.deleteMany({ where: { ministerioId: id } });
    await prisma.ministerio.delete({ where: { id } });

    return res.json({ mensagem: 'Ministério removido.' });
  } catch (error) {
    console.error('removerMinisterio:', error);
    return res.status(500).json({ mensagem: 'Erro ao remover ministério.', detalhe: error.message });
  }
};

exports.aprovarVoluntario = async (req, res) => {
  console.log('aprovarVoluntario called', { params: req.params, body: req.body, usuario: req.usuario });
  try {
    const ministerioId = Number(req.params.id);
    const voluntarioId = Number(req.body?.voluntarioId);
    if (!ministerioId || !voluntarioId || Number.isNaN(ministerioId) || Number.isNaN(voluntarioId)) {
      return res.status(400).json({ mensagem: 'IDs obrigatórios e numéricos: ministerioId (params) e voluntarioId (body).' });
    }

    // garantir que ministério e usuário existem
    const [ministerio, voluntario] = await Promise.all([
      prisma.ministerio.findUnique({ where: { id: ministerioId } }),
      prisma.usuario.findUnique({ where: { id: voluntarioId } })
    ]);

    if (!ministerio) return res.status(404).json({ mensagem: 'Ministério não encontrado.' });
    if (!voluntario) return res.status(404).json({ mensagem: 'Voluntário não encontrado.' });

    // tenta encontrar vínculo existente
    let vinculacao = null;
    try {
      vinculacao = await prisma.usuarioMinisterio.findUnique({
        where: { usuarioId_ministerioId: { usuarioId: voluntarioId, ministerioId } }
      });
    } catch (_e) {
      vinculacao = await prisma.usuarioMinisterio.findFirst({
        where: { usuarioId: voluntarioId, ministerioId }
      });
    }

    if (!vinculacao) {
      try {
        const criado = await prisma.usuarioMinisterio.create({
          data: { usuarioId: voluntarioId, ministerioId }
        });
        return res.status(201).json(criado);
      } catch (createErr) {
        console.error('aprovarVoluntario - createErr:', createErr);
        // FK violation -> recurso não existe (defensivo)
        if (createErr.code === 'P2003') {
          return res.status(404).json({ mensagem: 'Não foi possível criar vínculo: ministério ou usuário não encontrado.' });
        }
        if (createErr.code === 'P2002') {
          return res.status(200).json({ mensagem: 'Vínculo já existe (conflito tratado).' });
        }
        return res.status(500).json({ mensagem: 'Erro ao criar vínculo do voluntário.', detalhe: createErr.message });
      }
    }

    // atualiza status se existir campo
    if ('status' in vinculacao) {
      try {
        const atualizado = await prisma.usuarioMinisterio.update({
          where: { id: vinculacao.id },
          data: { status: 'APROVADO' }
        });
        return res.status(200).json(atualizado);
      } catch (updateErr) {
        console.error('aprovarVoluntario - updateErr:', updateErr);
        return res.status(500).json({ mensagem: 'Erro ao aprovar solicitação.', detalhe: updateErr.message });
      }
    }

    return res.status(200).json({ mensagem: 'Voluntário aprovado no ministério (vínculo já existente).' });
  } catch (error) {
    console.error('aprovarVoluntario:', error);
    return res.status(500).json({ mensagem: 'Erro ao aprovar voluntário.', detalhe: error.message });
  }
};

exports.solicitarIngresso = async (req, res) => {
  try {
    const usuarioId = Number(req.usuario?.id);
    const ministerioId = Number(req.body.ministerioId);
    if (!usuarioId || !ministerioId) return res.status(400).json({ mensagem: 'IDs obrigatórios.' });

    // contar ministérios APROVADOS do usuário
    const totalAprovados = await prisma.usuarioMinisterio.count({
      where: { usuarioId, status: 'APROVADO' }
    });
    if (totalAprovados >= 2) {
      return res.status(400).json({ mensagem: 'Limite de 2 ministérios já atingido.' });
    }

    // verificar duplicata (qualquer status)
    const existente = await prisma.usuarioMinisterio.findUnique({
      where: { usuarioId_ministerioId: { usuarioId, ministerioId } }
    });
    if (existente) {
      return res.status(200).json({ mensagem: 'Solicitação já existente.', status: existente.status });
    }

    const pedido = await prisma.usuarioMinisterio.create({
      data: { usuarioId, ministerioId, status: 'PENDENTE' }
    });

    return res.status(201).json({ mensagem: 'Solicitação enviada.', pedido });
  } catch (error) {
    console.error('solicitarIngresso:', error);
    return res.status(500).json({ mensagem: 'Erro ao solicitar ingresso.' });
  }
};

module.exports = {
  criarMinisterio: exports.criarMinisterio,
  editarMinisterio: exports.editarMinisterio,
  removerMinisterio: exports.removerMinisterio,
  atribuirLider: exports.atribuirLider,
  adicionarVoluntario: exports.adicionarVoluntario,
  aprovarVoluntario: exports.aprovarVoluntario,
  solicitarIngresso: exports.solicitarIngresso,
};
