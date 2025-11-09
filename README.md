# scale_volunteers

API para gestão de voluntários, ministérios e escalas (Node.js + Express + Prisma).

## Setup rápido

1. Instalar dependências:

```bash
npm install
```

2. Configurar .env (exemplo mínimo):

```
DATABASE_URL="postgresql://user:pass@localhost:5432/scale_volunteers"
JWT_SECRET="seu_secret_aqui"
PORT=3000
```

3. Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init   # ou npx prisma db push
npx prisma studio
```

4. Rodar em desenvolvimento:

```bash
npm run dev
```

## Observações importantes

- Envie o header Authorization sem aspas:
  `Authorization: Bearer <TOKEN_SEM_ASPAS>`
- O JWT deve conter `id` e `tipo` (ou `role`) no payload; o middleware popula `req.usuario.id` e `req.usuario.tipo`.
- Todas as rotas protegidas exigem `Content-Type: application/json` quando enviam body JSON.

## Rotas principais (resumo)

Auth

- POST /auth/login
  - Body: { "email": "...", "senha": "..." }
  - Retorna: { token, usuario }

Admin (protegidas: verificarToken + authorizeAdmin)

- POST /admin/ministerios
  - Criar ministério
- PUT /admin/ministerios/:id
  - Editar ministério
- DELETE /admin/ministerios/:id
  - Remover ministério (bloqueia se houver escalas ativas)
- POST /admin/ministerios/:id/atribuir-lider
  - Body: { "liderId": 10, "force": true }
  - Impede que um usuário lidere mais de 1 ministério (use `force:true` para transferir)
- POST /admin/ministerios/:id/atribuir-voluntario
  - Adiciona voluntário ao ministério

Ministerios (mount: `/ministerios`)

- POST /ministerios/:id/atribuir-lider
  - Mesma funcionalidade de atribuir líder (se preferir sem /admin)
- POST /ministerios/:id/aprovar-voluntario
  - Body: { "voluntarioId": 5 }
  - O líder ou admin aprova/insere vínculo de voluntário no ministério
- POST /ministerios/:id/escalas
  - Criar escala no ministério (somente líder do ministério ou admin)
  - Body: { "dataHora":"2025-11-15T10:00:00.000Z", "voluntarios":[6,1] }

Voluntário (mount: `/voluntario`)

- POST /voluntario/solicitar-ministerio
  - Body: { "ministerioId": 3 }
  - Usuário pode solicitar ingresso — máximo 2 ministérios aprovados
- POST /voluntario/escalas/:escalaId/presenca
  - Confirmar presença (usuário precisa estar designado na escala)

## Exemplos curl

Login:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exemplo.com","senha":"senha"}'
```

Atribuir líder (exemplo):

```bash
curl -X POST http://localhost:3000/ministerios/10/atribuir-lider \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"liderId":10,"force":true}'
```

Criar escala como líder:

```bash
curl -X POST "http://localhost:3000/ministerios/10/escalas" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dataHora":"2025-11-15T10:00:00.000Z","voluntarios":[6,1]}'
```

Solicitar ingresso (voluntário):

```bash
curl -X POST http://localhost:3000/voluntario/solicitar-ministerio \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ministerioId":3}'
```

## Debug rápido

- Ver logs do servidor ao executar requests (app já possui log de requisições).
- Use `npx prisma studio` para inspecionar dados e confirmar `liderId`, vínculos e escalas.
- Decodificar token para checar payload:

```bash
node -e "console.log(require('jsonwebtoken').decode('SEU_TOKEN'))"
```

## Próximos passos sugeridos

- Adicionar testes automatizados (jest + supertest) para endpoints críticos.
- Melhorar validações de entrada (Joi/zod) e tratar casos de concorrência com transações Prisma.
