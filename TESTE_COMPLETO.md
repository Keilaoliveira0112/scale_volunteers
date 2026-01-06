# 🧪 Teste Completo da API - Scale Volunteers

## 📋 Base URL

```
http://localhost:3000
```

---

## 1️⃣ AUTENTICAÇÃO - /auth

### Register (Criar novo usuário)

**POST** `/auth/register`

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "tipo": "voluntario"
}
```

**Respostas esperadas:**

- ✅ 201 - Usuário registrado com sucesso
- ❌ 400 - Email já cadastrado ou dados inválidos

---

### Login (Autenticar)

**POST** `/auth/login`

```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta:**

```json
{
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "tipo": "voluntario"
  }
}
```

---

### Obter Perfil (Autenticado)

**GET** `/auth/perfil`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Respostas esperadas:**

- ✅ 200 - Retorna dados do usuário
- ❌ 401 - Token inválido ou expirado

---

### Atualizar Perfil (Autenticado)

**PUT** `/auth/perfil`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Body:**

```json
{
  "nome": "João Silva Updated",
  "email": "joao.novo@example.com"
}
```

---

## 2️⃣ USUÁRIOS - /usuarios

### Listar Todos os Usuários (Admin)

**GET** `/usuarios`

**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

---

### Obter Usuário por ID

**GET** `/usuarios/:id`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Nota:** Apenas o próprio usuário ou admin pode acessar

---

### Deletar Usuário

**DELETE** `/usuarios/:id`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Nota:** Apenas o próprio usuário ou admin pode deletar

---

## 3️⃣ MINISTÉRIOS - /ministerios

### Listar Todos os Ministérios

**GET** `/ministerios`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Resposta esperada:**

```json
[
  {
    "id": 1,
    "nome": "Louvor",
    "descricao": "Ministério de louvor",
    "liderId": null
  },
  ...
]
```

---

### Obter Ministério por ID

**GET** `/ministerios/:id`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

---

### Criar Ministério (Admin)

**POST** `/ministerios`

**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

**Body:**

```json
{
  "nome": "Louvor",
  "descricao": "Ministério de louvor e adoração"
}
```

---

### Editar Ministério (Admin ou Líder)

**PUT** `/ministerios/:id`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Body:**

```json
{
  "nome": "Louvor Atualizado",
  "descricao": "Nova descrição"
}
```

---

### Deletar Ministério (Admin)

**DELETE** `/ministerios/:id`

**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

**Validação:** Não pode deletar se houver escalas ativas

---

### Atribuir Líder ao Ministério (Admin)

**POST** `/ministerios/:id/atribuir-lider`

**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

**Body:**

```json
{
  "liderId": 2,
  "force": false
}
```

**Validação:**

- Cada ministério pode ter apenas 1 líder
- Use `force: true` para substituir um líder existente

---

### Adicionar Voluntário ao Ministério

**POST** `/ministerios/:id/voluntarios`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Body:**

```json
{
  "voluntarioId": 3
}
```

**Validações:**

- Voluntário não pode pertencer a mais de 2 ministérios aprovados
- Status inicial: PENDENTE (aguardando aprovação do líder)

---

### Aprovar Voluntário

**POST** `/ministerios/:id/aprovar-voluntario`

**Headers:**

```
Authorization: Bearer {TOKEN_LIDER}
```

**Body:**

```json
{
  "usuarioId": 3
}
```

**Validações:**

- Apenas líder ou admin pode aprovar
- Muda status de PENDENTE para APROVADO

---

### Listar Voluntários do Ministério

**GET** `/ministerios/:id/voluntarios`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Resposta:**

```json
[
  {
    "usuarioId": 3,
    "ministerioId": 1,
    "status": "APROVADO",
    "usuario": {
      "id": 3,
      "nome": "Maria",
      "email": "maria@example.com"
    }
  },
  ...
]
```

---

## 4️⃣ ESCALAS - /escalas

### Criar Escala (Admin/Líder)

**POST** `/escalas`

**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN_OU_LIDER}
```

**Body:**

```json
{
  "ministerioId": 1,
  "dataHora": "2026-01-10T19:00:00Z",
  "voluntarios": [3, 4, 5]
}
```

**Validações:**

- Apenas admin ou líder do ministério
- Voluntários devem estar aprovados no ministério
- Não pode haver conflito (48h de diferença para mesma pessoa)

---

### Listar Escalas

**GET** `/escalas`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Query params:**

```
?ministerioId=1        # Filtrar por ministério
?voluntarioId=3        # Filtrar por voluntário
```

---

### Obter Escala por ID

**GET** `/escalas/:id`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

---

### Confirmar Presença

**POST** `/escalas/:id/confirmar-presenca`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Body:**

```json
{
  "voluntarioId": 3,
  "presenteConfirmado": true
}
```

**Validações:**

- Voluntário deve estar na escala
- Apenas voluntário ou admin pode confirmar sua presença
- Janela de confirmação: até 48h antes da escala

---

### Editar Escala (Líder/Admin)

**PUT** `/escalas/:id`

**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Body:**

```json
{
  "dataHora": "2026-01-11T19:00:00Z"
}
```

---

### Deletar Escala (Admin)

**DELETE** `/escalas/:id`

**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

---

## 5️⃣ ADMIN - /admin

### Dashboard Admin

**GET** `/admin/dashboard`

**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

**Retorna:**

- Total de usuários
- Total de ministérios
- Total de escalas
- Escalas próximas
- Usuários por tipo

---

### Listar Usuários (Admin)

**GET** `/admin/usuarios`

**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

**Query params:**

```
?tipo=admin            # Filtrar por tipo
?limit=10
?offset=0
```

---

## 6️⃣ LÍDER - /lider

### Criar Escala por Líder

**POST** `/lider/escalas`

**Headers:**

```
Authorization: Bearer {TOKEN_LIDER}
```

**Body:**

```json
{
  "ministerioId": 1,
  "dataHora": "2026-01-10T19:00:00Z",
  "voluntarios": [3, 4]
}
```

**Validação:** Usuário deve ser líder do ministério

---

### Listar Escalas (Líder)

**GET** `/lider/escalas`

**Headers:**

```
Authorization: Bearer {TOKEN_LIDER}
```

**Retorna:** Apenas escalas dos ministérios onde é líder

---

## 7️⃣ VOLUNTÁRIO - /voluntarios

### Solicitar Ingresso em Ministério

**POST** `/voluntarios/solicitar-ministerio`

**Headers:**

```
Authorization: Bearer {TOKEN_VOLUNTARIO}
```

**Body:**

```json
{
  "ministerioId": 1
}
```

**Validações:**

- Voluntário não pode ter mais de 2 solicitações PENDENTES
- Se aprovado anteriormente, erro

---

### Minhas Escalas

**GET** `/voluntarios/minhas-escalas`

**Headers:**

```
Authorization: Bearer {TOKEN_VOLUNTARIO}
```

**Retorna:** Escalas onde o voluntário está registrado

---

## ⚠️ CÓDIGOS DE ERRO COMUNS

| Código | Significado                             |
| ------ | --------------------------------------- |
| 400    | Requisição inválida (dados incompletos) |
| 401    | Não autenticado ou token expirado       |
| 403    | Sem permissão para esta ação            |
| 404    | Recurso não encontrado                  |
| 500    | Erro do servidor                        |

---

## 🔐 TIPOS DE USUÁRIO

| Tipo           | Permissões                    |
| -------------- | ----------------------------- |
| **admin**      | Acesso total a tudo           |
| **lider**      | Gerencia seu(s) ministério(s) |
| **voluntario** | Participa de escalas          |

---

## 🧪 FLUXO DE TESTE RECOMENDADO

1. **Registrar 3 usuários:**

   - `admin@example.com` (tipo: admin)
   - `lider@example.com` (tipo: lider)
   - `voluntario@example.com` (tipo: voluntario)

2. **Login com cada um e guardar tokens**

3. **Com admin token:**

   - Criar ministérios
   - Atribuir líderes

4. **Com líder token:**

   - Adicionar voluntários
   - Aprovar voluntários

5. **Com voluntário token:**

   - Solicitar ingresso (se ainda não aprovado)
   - Visualizar escalas

6. **Com admin token:**

   - Criar escalas
   - Confirmar presença

7. **Testar validações:**
   - Tentar criar 3º ministério (deve falhar - max 2)
   - Tentar escalas com conflito
   - Tentar acessar dados de outro usuário (deve falhar)

---

## 📝 VARIÁVEIS DE AMBIENTE (.env)

```
DATABASE_URL="postgresql://user:password@localhost:5432/scale_volunteers"
JWT_SECRET="seu_secret_key_aqui"
PORT=3000
NODE_ENV=development
```

---

## 🚀 INICIANDO O SERVIDOR

```bash
cd c:\Users\keila\Documents\scale_volunteers

# Instalar dependências
npm install

# Executar migrações Prisma
npx prisma migrate dev

# Iniciar servidor
npm run dev
# ou
node src/app.js
```

---

## ✅ CHECKLIST DE TESTE

- [ ] Register com sucesso
- [ ] Login com sucesso
- [ ] Obtém token JWT válido
- [ ] Obter perfil autenticado
- [ ] Atualizar perfil
- [ ] Admin consegue criar ministério
- [ ] Admin consegue atribuir líder
- [ ] Líder consegue adicionar voluntário
- [ ] Voluntário status = PENDENTE
- [ ] Líder consegue aprovar voluntário
- [ ] Voluntário status = APROVADO
- [ ] Admin consegue criar escala
- [ ] Voluntário consegue confirmar presença
- [ ] Validação: max 2 ministérios
- [ ] Validação: max 1 líder por ministério
- [ ] Validação: conflito de datas (48h)

---

Boa sorte com os testes! 🎉
