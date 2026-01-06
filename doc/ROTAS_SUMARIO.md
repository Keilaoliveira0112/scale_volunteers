# 📋 Sumário Executivo de Rotas REST

## 🎯 Total: 40+ Rotas Implementadas

---

## 🔐 AUTENTICAÇÃO (2 rotas)

```
POST   /auth/register              - Registrar novo usuário
POST   /auth/login                 - Fazer login
GET    /auth/perfil                - Obter perfil autenticado
PUT    /auth/perfil                - Atualizar perfil
```

---

## 👥 USUÁRIOS (3 rotas de CRUD)

```
GET    /usuarios                   - Listar todos (admin)
GET    /usuarios/:id               - Obter por ID
DELETE /usuarios/:id               - Deletar usuário
```

---

## ⛪ MINISTÉRIOS (10 rotas)

```
CRUD BÁSICO:
GET    /ministerios                - Listar todos
GET    /ministerios/:id            - Obter por ID
POST   /ministerios                - Criar (admin)
PUT    /ministerios/:id            - Editar (admin/líder)
DELETE /ministerios/:id            - Deletar (admin)

OPERAÇÕES ESPECIAIS:
POST   /ministerios/:id/atribuir-lider              - Atribuir líder
POST   /ministerios/:id/voluntarios                 - Adicionar voluntário
GET    /ministerios/:id/voluntarios                 - Listar voluntários
POST   /ministerios/:id/aprovar-voluntario          - Aprovar voluntário
POST   /ministerios/:id/rejeitar-voluntario         - Rejeitar voluntário
```

---

## 📅 ESCALAS (8 rotas)

```
CRUD BÁSICO:
GET    /escalas                    - Listar todas
GET    /escalas/:id                - Obter por ID
POST   /escalas                    - Criar (admin)
PUT    /escalas/:id                - Editar (admin)
DELETE /escalas/:id                - Deletar (admin)

OPERAÇÕES ESPECIAIS:
POST   /escalas/:id/confirmar-presenca              - Confirmar presença
POST   /escalas/:id/adicionar-voluntario            - Adicionar voluntário
DELETE /escalas/:id/voluntarios/:voluntarioId       - Remover voluntário
```

---

## 🏢 ADMIN (2 rotas)

```
GET    /admin/dashboard            - Dashboard com estatísticas
GET    /admin/usuarios             - Listar usuários
```

---

## 👨‍✝️ LÍDER (7 rotas)

```
POST   /lider/escalas              - Criar escala
GET    /lider/escalas              - Listar escalas
GET    /lider/escalas/:ministerioId - Listar de um ministério

POST   /lider/ministerios/:ministerioId/voluntarios                  - Adicionar voluntário
GET    /lider/ministerios/:ministerioId/voluntarios                  - Listar voluntários
POST   /lider/ministerios/:ministerioId/aprovar-voluntario/:usuarioId   - Aprovar
POST   /lider/ministerios/:ministerioId/rejeitar-voluntario/:usuarioId  - Rejeitar
```

---

## 🙏 VOLUNTÁRIO (6 rotas)

```
POST   /voluntarios/solicitar-ministerio             - Solicitar ingresso
GET    /voluntarios/minhas-solicitacoes              - Ver solicitações
GET    /voluntarios/minhas-escalas                   - Ver escalas
POST   /voluntarios/escalas/:escalaId/confirmar-presenca - Confirmar presença
GET    /voluntarios/meus-ministerios                 - Ver ministérios
POST   /voluntarios/sair-ministerio/:ministerioId    - Sair de ministério
```

---

## 📊 Distribuição por Tipo de Permissão

| Tipo                | Quantidade |
| ------------------- | ---------- |
| Públicas (sem auth) | 2          |
| Autenticadas        | 20+        |
| Admin only          | 8          |
| Líder only          | 7          |
| Voluntário only     | 6          |
| **TOTAL**           | **40+**    |

---

## ✅ CRUD Completo por Entidade

| Entidade       | CREATE       | READ              | UPDATE         | DELETE        |
| -------------- | ------------ | ----------------- | -------------- | ------------- |
| **Usuário**    | ✅ register  | ✅ GET/:id, GET/  | ✅ PUT /perfil | ✅ DELETE/:id |
| **Ministério** | ✅ POST /    | ✅ GET/, GET/:id  | ✅ PUT /:id    | ✅ DELETE/:id |
| **Escala**     | ✅ POST /    | ✅ GET/, GET/:id  | ✅ PUT /:id    | ✅ DELETE/:id |
| **Voluntário** | ✅ solicitar | ✅ minhas-escalas | -              | ✅ sair       |

---

## 🔐 Matriz de Permissões

### Público

- ✅ POST `/auth/register`
- ✅ POST `/auth/login`

### Autenticado (Qualquer tipo)

- ✅ GET `/auth/perfil`
- ✅ PUT `/auth/perfil`
- ✅ GET `/ministerios`
- ✅ GET `/escalas`
- ✅ E muitos mais...

### Admin Only

- 🔒 POST `/ministerios` (criar)
- 🔒 DELETE `/ministerios/:id` (deletar)
- 🔒 POST `/ministerios/:id/atribuir-lider`
- 🔒 POST `/escalas` (criar)
- 🔒 DELETE `/escalas/:id` (deletar)
- 🔒 GET `/admin/dashboard`
- 🔒 GET `/admin/usuarios`

### Líder

- 🔒 POST `/lider/escalas` (criar no seu ministério)
- 🔒 POST `/lider/ministerios/:id/aprovar-voluntario/:usuarioId`
- 🔒 POST `/lider/ministerios/:id/adicionar-voluntario`

### Voluntário

- 🔒 POST `/voluntarios/solicitar-ministerio`
- 🔒 GET `/voluntarios/minhas-escalas`
- 🔒 POST `/voluntarios/escalas/:id/confirmar-presenca`

---

## 🎯 Fluxo de Negócio Completo

```
1. AUTENTICAÇÃO
   └─ POST /auth/register (público)
   └─ POST /auth/login (público)
   └─ GET /auth/perfil (autenticado)

2. ADMIN CRIA MINISTÉRIOS
   └─ POST /ministerios (admin)
   └─ POST /ministerios/:id/atribuir-lider (admin)

3. LÍDER GERENCIA VOLUNTÁRIOS
   └─ POST /ministerios/:id/voluntarios (aceita solicitação)
   └─ POST /ministerios/:id/aprovar-voluntario (aprova)

4. VOLUNTÁRIO PARTICIPA
   └─ POST /voluntarios/solicitar-ministerio (solicita ingresso)
   └─ GET /voluntarios/minhas-escalas (vê escalas)
   └─ POST /voluntarios/escalas/:id/confirmar-presenca (confirma)

5. ADMIN CRIA ESCALAS
   └─ POST /escalas (admin)
   └─ POST /escalas/:id/adicionar-voluntario (admin)

6. ADMIN VÊ DASHBOARD
   └─ GET /admin/dashboard (estatísticas)
```

---

## 🧪 Exemplo de Teste Completo

```bash
# 1. Registrar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Admin","email":"admin@example.com","senha":"123","tipo":"admin"}'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","senha":"123"}'
  # Copia o TOKEN

# 3. Criar ministério
curl -X POST http://localhost:3000/ministerios \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Louvor","descricao":"..."}'

# 4. Listar ministérios
curl -X GET http://localhost:3000/ministerios \
  -H "Authorization: Bearer TOKEN"

# 5. Criar escala
curl -X POST http://localhost:3000/escalas \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ministerioId":1,"dataHora":"2026-01-20T19:00:00Z","voluntarios":[3]}'
```

---

## 📝 Validações Implementadas

| Validação                        | Status |
| -------------------------------- | ------ |
| Max 2 ministérios por voluntário | ✅     |
| Max 1 líder por ministério       | ✅     |
| Detecção de conflito (48h)       | ✅     |
| Escalas ativas previnem deleção  | ✅     |
| Autorização por tipo de usuário  | ✅     |
| JWT token com expiração 1h       | ✅     |
| Bcrypt password hashing          | ✅     |

---

## 🚀 Status Geral

- ✅ Todas as rotas CRUD implementadas
- ✅ Autenticação e Autorização completas
- ✅ Validações de negócio
- ✅ Documentação completa
- ✅ Pronto para testes

---

**Próximo passo:** Execute os testes seguindo o GUIA_TESTES.md 🎉
