# 📋 Documentação das Rotas REST - Scale Volunteers

## 📌 Base URL

```
http://localhost:3000
```

---

## 🔐 AUTENTICAÇÃO `/auth`

### POST `/auth/register`

**Descrição:** Registrar novo usuário

- **Autenticação:** Não requerida
- **Body:**

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "tipo": "voluntario"
}
```

- **Respostas:** 201 Created, 400 Bad Request

---

### POST `/auth/login`

**Descrição:** Autenticar usuário e obter token JWT

- **Autenticação:** Não requerida
- **Body:**

```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

- **Response:** 200 OK

```json
{
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nome": "João",
    "email": "joao@example.com",
    "tipo": "voluntario"
  }
}
```

---

### GET `/auth/perfil`

**Descrição:** Obter perfil do usuário autenticado

- **Autenticação:** ✅ Requerida (Bearer Token)
- **Respostas:** 200 OK, 401 Unauthorized

---

### PUT `/auth/perfil`

**Descrição:** Atualizar perfil do usuário autenticado

- **Autenticação:** ✅ Requerida
- **Body:**

```json
{
  "nome": "João Silva Novo",
  "email": "joao.novo@example.com"
}
```

- **Respostas:** 200 OK, 400 Bad Request

---

## 👥 USUÁRIOS `/usuarios`

| Método | Rota            | Descrição       | Autenticação | Permissão        |
| ------ | --------------- | --------------- | ------------ | ---------------- |
| GET    | `/usuarios`     | Listar todos    | ✅           | Admin            |
| GET    | `/usuarios/:id` | Obter por ID    | ✅           | Próprio ou Admin |
| DELETE | `/usuarios/:id` | Deletar usuário | ✅           | Próprio ou Admin |

---

### GET `/usuarios`

**Descrição:** Listar todos os usuários (apenas admin)

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Respostas:** 200 OK

---

### GET `/usuarios/:id`

**Descrição:** Obter usuário por ID

- **Autenticação:** ✅ Requerida
- **Permissão:** Próprio usuário ou Admin
- **Exemplo:** `GET /usuarios/1`
- **Respostas:** 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found

---

### DELETE `/usuarios/:id`

**Descrição:** Deletar usuário

- **Autenticação:** ✅ Requerida
- **Permissão:** Próprio usuário ou Admin
- **Exemplo:** `DELETE /usuarios/3`
- **Respostas:** 200 OK, 401 Unauthorized, 403 Forbidden

---

## ⛪ MINISTÉRIOS `/ministerios`

| Método | Rota                                   | Descrição            | Autenticação | Permissão      |
| ------ | -------------------------------------- | -------------------- | ------------ | -------------- |
| GET    | `/ministerios`                         | Listar todos         | ✅           | Autenticado    |
| GET    | `/ministerios/:id`                     | Obter por ID         | ✅           | Autenticado    |
| POST   | `/ministerios`                         | Criar                | ✅           | Admin          |
| PUT    | `/ministerios/:id`                     | Editar               | ✅           | Admin ou Líder |
| DELETE | `/ministerios/:id`                     | Deletar              | ✅           | Admin          |
| POST   | `/ministerios/:id/atribuir-lider`      | Atribuir líder       | ✅           | Admin          |
| POST   | `/ministerios/:id/voluntarios`         | Adicionar voluntário | ✅           | Líder          |
| GET    | `/ministerios/:id/voluntarios`         | Listar voluntários   | ✅           | Autenticado    |
| POST   | `/ministerios/:id/aprovar-voluntario`  | Aprovar voluntário   | ✅           | Líder          |
| POST   | `/ministerios/:id/rejeitar-voluntario` | Rejeitar voluntário  | ✅           | Líder          |

---

### GET `/ministerios`

**Descrição:** Listar todos os ministérios

- **Autenticação:** ✅ Requerida
- **Query params:** Nenhum
- **Respostas:** 200 OK

---

### GET `/ministerios/:id`

**Descrição:** Obter ministério por ID

- **Autenticação:** ✅ Requerida
- **Exemplo:** `GET /ministerios/1`
- **Respostas:** 200 OK, 404 Not Found

---

### POST `/ministerios`

**Descrição:** Criar novo ministério (admin)

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Body:**

```json
{
  "nome": "Louvor",
  "descricao": "Ministério de louvor e adoração"
}
```

- **Respostas:** 201 Created, 400 Bad Request, 403 Forbidden

---

### PUT `/ministerios/:id`

**Descrição:** Editar ministério

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin ou Líder do ministério
- **Exemplo:** `PUT /ministerios/1`
- **Body:**

```json
{
  "nome": "Louvor Atualizado",
  "descricao": "Nova descrição"
}
```

- **Respostas:** 200 OK, 400 Bad Request, 403 Forbidden, 404 Not Found

---

### DELETE `/ministerios/:id`

**Descrição:** Deletar ministério (apenas admin)

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Exemplo:** `DELETE /ministerios/2`
- **Validação:** Não pode deletar se houver escalas ativas
- **Respostas:** 200 OK, 400 Bad Request, 403 Forbidden, 404 Not Found

---

### POST `/ministerios/:id/atribuir-lider`

**Descrição:** Atribuir líder ao ministério

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Exemplo:** `POST /ministerios/1/atribuir-lider`
- **Body:**

```json
{
  "liderId": 2,
  "force": false
}
```

- **Validação:** Cada ministério pode ter apenas 1 líder
- **Respostas:** 200 OK, 400 Bad Request, 403 Forbidden

---

### POST `/ministerios/:id/voluntarios`

**Descrição:** Adicionar voluntário ao ministério

- **Autenticação:** ✅ Requerida
- **Permissão:** Líder do ministério
- **Exemplo:** `POST /ministerios/1/voluntarios`
- **Body:**

```json
{
  "voluntarioId": 3
}
```

- **Validação:** Voluntário não pode ter mais de 2 ministérios aprovados
- **Respostas:** 201 Created, 400 Bad Request, 403 Forbidden

---

### GET `/ministerios/:id/voluntarios`

**Descrição:** Listar voluntários do ministério

- **Autenticação:** ✅ Requerida
- **Exemplo:** `GET /ministerios/1/voluntarios`
- **Respostas:** 200 OK

---

### POST `/ministerios/:id/aprovar-voluntario`

**Descrição:** Aprovar voluntário no ministério

- **Autenticação:** ✅ Requerida
- **Permissão:** Líder
- **Body:**

```json
{
  "usuarioId": 3
}
```

- **Respostas:** 200 OK, 400 Bad Request, 403 Forbidden

---

### POST `/ministerios/:id/rejeitar-voluntario`

**Descrição:** Rejeitar voluntário no ministério

- **Autenticação:** ✅ Requerida
- **Permissão:** Líder
- **Body:**

```json
{
  "usuarioId": 3
}
```

- **Respostas:** 200 OK, 400 Bad Request, 403 Forbidden

---

## 📅 ESCALAS `/escalas`

| Método | Rota                                     | Descrição            | Autenticação | Permissão   |
| ------ | ---------------------------------------- | -------------------- | ------------ | ----------- |
| GET    | `/escalas`                               | Listar todas         | ✅           | Autenticado |
| GET    | `/escalas/:id`                           | Obter por ID         | ✅           | Autenticado |
| POST   | `/escalas`                               | Criar                | ✅           | Admin       |
| PUT    | `/escalas/:id`                           | Editar               | ✅           | Admin       |
| DELETE | `/escalas/:id`                           | Deletar              | ✅           | Admin       |
| POST   | `/escalas/:id/confirmar-presenca`        | Confirmar presença   | ✅           | Voluntário  |
| POST   | `/escalas/:id/adicionar-voluntario`      | Adicionar voluntário | ✅           | Admin       |
| DELETE | `/escalas/:id/voluntarios/:voluntarioId` | Remover voluntário   | ✅           | Admin       |

---

### GET `/escalas`

**Descrição:** Listar todas as escalas

- **Autenticação:** ✅ Requerida
- **Query params:** Nenhum
- **Respostas:** 200 OK

---

### GET `/escalas/:id`

**Descrição:** Obter escala por ID

- **Autenticação:** ✅ Requerida
- **Exemplo:** `GET /escalas/1`
- **Respostas:** 200 OK, 404 Not Found

---

### POST `/escalas`

**Descrição:** Criar nova escala

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Body:**

```json
{
  "ministerioId": 1,
  "dataHora": "2026-01-20T19:00:00Z",
  "voluntarios": [3, 4, 5]
}
```

- **Validações:**
  - Voluntários devem estar aprovados no ministério
  - Não pode haver conflito (48h de diferença)
- **Respostas:** 201 Created, 400 Bad Request, 403 Forbidden

---

### PUT `/escalas/:id`

**Descrição:** Editar escala

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Exemplo:** `PUT /escalas/1`
- **Body:**

```json
{
  "dataHora": "2026-01-21T19:00:00Z"
}
```

- **Respostas:** 200 OK, 400 Bad Request, 403 Forbidden, 404 Not Found

---

### DELETE `/escalas/:id`

**Descrição:** Deletar escala

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Exemplo:** `DELETE /escalas/1`
- **Respostas:** 200 OK, 403 Forbidden, 404 Not Found

---

### POST `/escalas/:id/confirmar-presenca`

**Descrição:** Confirmar presença do voluntário

- **Autenticação:** ✅ Requerida
- **Permissão:** Voluntário ou Admin
- **Body:**

```json
{
  "voluntarioId": 3,
  "presenteConfirmado": true
}
```

- **Validação:** Janela de 48h antes da escala
- **Respostas:** 200 OK, 400 Bad Request, 403 Forbidden

---

### POST `/escalas/:id/adicionar-voluntario`

**Descrição:** Adicionar voluntário à escala

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Body:**

```json
{
  "voluntarioId": 3
}
```

- **Respostas:** 201 Created, 400 Bad Request, 403 Forbidden

---

### DELETE `/escalas/:id/voluntarios/:voluntarioId`

**Descrição:** Remover voluntário da escala

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Exemplo:** `DELETE /escalas/1/voluntarios/3`
- **Respostas:** 200 OK, 403 Forbidden, 404 Not Found

---

## 🏢 ADMIN `/admin`

| Método | Rota               | Descrição       | Autenticação | Permissão |
| ------ | ------------------ | --------------- | ------------ | --------- |
| GET    | `/admin/dashboard` | Dashboard       | ✅           | Admin     |
| GET    | `/admin/usuarios`  | Listar usuários | ✅           | Admin     |

---

### GET `/admin/dashboard`

**Descrição:** Obter dashboard com estatísticas

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Respostas:** 200 OK

---

### GET `/admin/usuarios`

**Descrição:** Listar todos os usuários

- **Autenticação:** ✅ Requerida
- **Permissão:** Admin
- **Respostas:** 200 OK

---

## 👨‍✝️ LÍDER `/lider`

| Método | Rota                                                              | Descrição               | Autenticação | Permissão |
| ------ | ----------------------------------------------------------------- | ----------------------- | ------------ | --------- |
| POST   | `/lider/escalas`                                                  | Criar escala            | ✅           | Líder     |
| GET    | `/lider/escalas`                                                  | Listar escalas          | ✅           | Líder     |
| GET    | `/lider/escalas/:ministerioId`                                    | Listar de um ministério | ✅           | Líder     |
| POST   | `/lider/ministerios/:ministerioId/voluntarios`                    | Adicionar voluntário    | ✅           | Líder     |
| GET    | `/lider/ministerios/:ministerioId/voluntarios`                    | Listar voluntários      | ✅           | Líder     |
| POST   | `/lider/ministerios/:ministerioId/aprovar-voluntario/:usuarioId`  | Aprovar                 | ✅           | Líder     |
| POST   | `/lider/ministerios/:ministerioId/rejeitar-voluntario/:usuarioId` | Rejeitar                | ✅           | Líder     |

---

### POST `/lider/escalas`

**Descrição:** Criar escala no ministério que lidera

- **Autenticação:** ✅ Requerida
- **Permissão:** Líder
- **Body:**

```json
{
  "ministerioId": 1,
  "dataHora": "2026-01-20T19:00:00Z",
  "voluntarios": [3, 4]
}
```

- **Respostas:** 201 Created, 400 Bad Request, 403 Forbidden

---

### GET `/lider/escalas`

**Descrição:** Listar escalas dos ministérios que lidera

- **Autenticação:** ✅ Requerida
- **Permissão:** Líder
- **Respostas:** 200 OK

---

## 🙏 VOLUNTÁRIO `/voluntarios`

| Método | Rota                                                | Descrição          | Autenticação | Permissão  |
| ------ | --------------------------------------------------- | ------------------ | ------------ | ---------- |
| POST   | `/voluntarios/solicitar-ministerio`                 | Solicitar ingresso | ✅           | Voluntário |
| GET    | `/voluntarios/minhas-solicitacoes`                  | Ver solicitações   | ✅           | Voluntário |
| GET    | `/voluntarios/minhas-escalas`                       | Ver escalas        | ✅           | Voluntário |
| POST   | `/voluntarios/escalas/:escalaId/confirmar-presenca` | Confirmar presença | ✅           | Voluntário |
| GET    | `/voluntarios/meus-ministerios`                     | Ver ministérios    | ✅           | Voluntário |
| POST   | `/voluntarios/sair-ministerio/:ministerioId`        | Sair de ministério | ✅           | Voluntário |

---

### POST `/voluntarios/solicitar-ministerio`

**Descrição:** Solicitar ingresso em um ministério

- **Autenticação:** ✅ Requerida
- **Body:**

```json
{
  "ministerioId": 2
}
```

- **Validação:** Max 2 ministérios por voluntário
- **Respostas:** 201 Created, 400 Bad Request

---

### GET `/voluntarios/minhas-solicitacoes`

**Descrição:** Listar solicitações pendentes do voluntário

- **Autenticação:** ✅ Requerida
- **Respostas:** 200 OK

---

### GET `/voluntarios/minhas-escalas`

**Descrição:** Listar escalas do voluntário

- **Autenticação:** ✅ Requerida
- **Respostas:** 200 OK

---

### POST `/voluntarios/escalas/:escalaId/confirmar-presenca`

**Descrição:** Confirmar presença em uma escala

- **Autenticação:** ✅ Requerida
- **Body:**

```json
{
  "presenteConfirmado": true
}
```

- **Respostas:** 200 OK, 400 Bad Request

---

### GET `/voluntarios/meus-ministerios`

**Descrição:** Listar ministérios onde está aprovado

- **Autenticação:** ✅ Requerida
- **Respostas:** 200 OK

---

### POST `/voluntarios/sair-ministerio/:ministerioId`

**Descrição:** Sair de um ministério

- **Autenticação:** ✅ Requerida
- **Respostas:** 200 OK, 404 Not Found

---

## 📊 Resumo de Rotas por Tipo

### 🔓 Públicas (Sem Autenticação)

- POST `/auth/register`
- POST `/auth/login`

### 🔒 Protegidas (Autenticado)

- GET `/auth/perfil`
- PUT `/auth/perfil`
- GET `/usuarios/:id`
- GET `/ministerios`
- GET `/ministerios/:id`
- GET `/ministerios/:id/voluntarios`
- GET `/escalas`
- GET `/escalas/:id`
- POST `/escalas/:id/confirmar-presenca`
- GET `/voluntarios/minhas-escalas`
- GET `/voluntarios/meus-ministerios`
- E mais...

### 👑 Apenas Admin

- GET `/usuarios`
- DELETE `/usuarios/:id`
- POST `/ministerios`
- DELETE `/ministerios/:id`
- POST `/ministerios/:id/atribuir-lider`
- POST `/escalas`
- PUT `/escalas/:id`
- DELETE `/escalas/:id`
- GET `/admin/dashboard`
- GET `/admin/usuarios`

---

## 🔑 Headers Obrigatórios

Todas as rotas protegidas requerem:

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

---

## 📈 Códigos de Status HTTP

| Código | Significado                              |
| ------ | ---------------------------------------- |
| 200    | OK - Sucesso                             |
| 201    | Created - Recurso criado                 |
| 400    | Bad Request - Dados inválidos            |
| 401    | Unauthorized - Sem token/token inválido  |
| 403    | Forbidden - Sem permissão                |
| 404    | Not Found - Recurso não encontrado       |
| 500    | Internal Server Error - Erro do servidor |

---

Fim da documentação! 🎉
