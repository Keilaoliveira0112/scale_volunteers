// services/escalaService.js
const escalaRepository = require("../repositories/escalaRepository");

const escalaService = {
  criarEscala: async (data, usuario) => {
    // Regra 1: só admin ou líder pode criar
    if (usuario.tipo !== "admin" && usuario.tipo !== "lider") {
      throw new Error("Apenas admin ou líder podem criar escalas");
    }

    return await escalaRepository.criar(data);
  },

  buscarPorId: async (id) => {
    const escala = await escalaRepository.buscarPorId(id);
    if (!escala) throw new Error("Escala não encontrada");
    return escala;
  },

  listarTodas: async () => {
    return await escalaRepository.listarTodas();
  },

  listarPorMinisterio: async (ministerioId) => {
    return await escalaRepository.listarPorMinisterio(ministerioId);
  },

  listarPorVoluntario: async (voluntarioId) => {
    return await escalaRepository.listarPorVoluntario(voluntarioId);
  },

  atualizar: async (id, dados) => {
    const escala = await escalaRepository.buscarPorId(id);
    if (!escala) throw new Error("Escala não encontrada");
    return await escalaRepository.atualizar(id, dados);
  },

  deletar: async (id) => {
    const escala = await escalaRepository.buscarPorId(id);
    if (!escala) throw new Error("Escala não encontrada");
    return await escalaRepository.deletar(id);
  },

  adicionarVoluntario: async (escalaId, voluntarioId) => {
    return await escalaRepository.adicionarVoluntario(escalaId, voluntarioId);
  },

  verificarConflito: async (voluntarioId, dataInicio, dataFim) => {
    return await escalaRepository.verificarConflito(voluntarioId, dataInicio, dataFim);
  }
};

module.exports = escalaService;
