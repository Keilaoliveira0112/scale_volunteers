# 📚 Guia de Teste Completo - Scale Volunteers API

## 📋 Objetivo

Testar todas as rotas da API de gerenciamento de escalas de voluntários com suporte a:

- ✅ Autenticação JWT
- ✅ Autorização baseada em tipos de usuário (admin, líder, voluntário)
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validações de negócio

---

## 🚀 Iniciar o Servidor

```bash
cd c:\Users\keila\Documents\scale_volunteers

# Instalar dependências (se não estiver instalado)
npm install

# Iniciar o servidor
npm run dev
# ou
node src/app.js
```

Servidor rodando em: **http://localhost:3000**

---

## 🧪 Opções de Teste

### Opção 1: **Postman** (Recomendado - Interface Gráfica)

#### 1. Abrir Postman

#### 2. Importar Collection

- Clique em **Import**
- Selecione o arquivo: `Scale_Volunteers_API.postman_collection.json`

#### 3. Configurar Environment

- Na collection, vá em **Variables**
- Configure:
  - `base_url`: `http://localhost:3000`
  - `admin_token`: (será preenchido após login)
  - `lider_token`: (será preenchido após login)
  - `voluntario_token`: (será preenchido após login)

#### 4. Executar Testes

- Comece pelo grupo **AUTENTICAÇÃO**
- Execute **Register** para cada tipo de usuário
- Execute **Login** e **copie os tokens**
- Preencha os tokens nas variáveis
- Execute os testes de cada grupo na ordem

---

### Opção 2: **Script Bash/PowerShell** (Automático)

#### No Linux/Mac:

```bash
cd c:\Users\keila\Documents\scale_volunteers
bash teste_api.sh
```

#### No Windows PowerShell:

```powershell
cd c:\Users\keila\Documents\scale_volunteers
bash teste_api.sh
```

**Nota:** Instale o `jq` para parsing JSON:

- Windows: `choco install jq` ou baixe em https://stedolan.github.io/jq/
- Linux: `sudo apt-get install jq`
- Mac: `brew install jq`

---

### Opção 3: **cURL Manualmente**

#### 1. Registrar um Admin:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Admin User\",
    \"email\": \"admin@example.com\",
    \"senha\": \"senha123\",
    \"tipo\": \"admin\"
  }"
```

#### 2. Login e obter token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"admin@example.com\",
    \"senha\": \"senha123\"
  }"
```

#### 3. Usar o token em requisições:

```bash
curl -X GET http://localhost:3000/auth/perfil \
  -H "Authorization: Bearer {SEU_TOKEN_AQUI}"
```

---

## 📝 Fluxo de Teste Recomendado

### Phase 1: Autenticação ✅

1. [ ] Registrar admin
2. [ ] Registrar líder
3. [ ] Registrar voluntário
4. [ ] Login de cada um e guardar tokens

### Phase 2: Usuários 👥

5. [ ] Obter perfil autenticado
6. [ ] Atualizar perfil
7. [ ] Listar todos (admin)
8. [ ] Obter usuário por ID

### Phase 3: Ministérios ⛪

9. [ ] Criar ministério (admin)
10. [ ] Listar ministérios
11. [ ] Obter ministério por ID
12. [ ] Atribuir líder (admin)
13. [ ] Editar ministério
14. [ ] Adicionar voluntário

### Phase 4: Gerenciamento de Voluntários

15. [ ] Listar voluntários do ministério
16. [ ] Aprovar voluntário (líder)
17. [ ] Validar: Max 2 ministérios por voluntário

### Phase 5: Escalas 📅

18. [ ] Criar escala (admin)
19. [ ] Listar escalas
20. [ ] Obter escala por ID
21. [ ] Confirmar presença
22. [ ] Editar escala
23. [ ] Validar conflito de datas (48h)

### Phase 6: Admin Dashboard 🏢

24. [ ] Acessar dashboard admin
25. [ ] Ver estatísticas

### Phase 7: Validações de Segurança 🔒

26. [ ] Tentar acessar dados de outro usuário (deve falhar)
27. [ ] Usar token inválido (deve retornar 401)
28. [ ] Tentar ação de admin com token de voluntário (deve falhar)
29. [ ] Tentar deletar ministério com escalas ativas (deve falhar)

---

## 📊 Respostas Esperadas

### Sucesso (2xx)

```json
{
  "mensagem": "Descrição do sucesso",
  "data": { ... }
}
```

### Erro de Validação (400)

```json
{
  "mensagem": "Descrição do erro de validação"
}
```

### Não Autenticado (401)

```json
{
  "mensagem": "Usuário não autenticado"
}
```

### Sem Permissão (403)

```json
{
  "mensagem": "Sem permissão para acessar este recurso"
}
```

### Não Encontrado (404)

```json
{
  "mensagem": "Recurso não encontrado"
}
```

---

## 🔑 Tokens JWT

Os tokens têm:

- ✅ Expiração: 1 hora
- ✅ Payload: `{ id, email, tipo }`
- ✅ Secret: Definido em `.env` como `JWT_SECRET`

### Decodificar token (online):

- Acesse: https://jwt.io
- Cole o token na área de "Encoded"
- Veja o payload decodificado

---

## ⚙️ Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/scale_volunteers"

# JWT
JWT_SECRET="sua_chave_secreta_muito_segura_aqui"

# Server
PORT=3000
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### "Erro de conexão com banco de dados"

- Certifique-se que o PostgreSQL está rodando
- Verifique a `DATABASE_URL` no `.env`
- Execute: `npx prisma migrate dev`

### "Token inválido ou expirado"

- Faça login novamente para obter um novo token
- Copie o token correto do response

### "Sem permissão para esta ação"

- Verifique se está usando o token correto
- Verifique o tipo de usuário (`admin`, `líder`, `voluntario`)

### "Email já cadastrado"

- Use um email diferente para cada teste
- Ou limpe o banco: `npx prisma migrate reset`

---

## 📌 Checklist Final

- [ ] Todas as 27 requisições testadas
- [ ] Todos os status codes corretos (200, 201, 400, 401, 403, 404)
- [ ] Validações de negócio funcionando:
  - [ ] Max 2 ministérios por voluntário
  - [ ] Max 1 líder por ministério
  - [ ] Detecção de conflito de datas (48h)
  - [ ] Escalas ativas previnem deleção de ministério
- [ ] Segurança funcionando:
  - [ ] Apenas admin acessa certos endpoints
  - [ ] Voluntários não podem ver dados de outros
  - [ ] Tokens expiram corretamente

---

## 📚 Documentação Adicional

- **TESTE_COMPLETO.md** - Especificação completa de todas as rotas
- **teste_api.sh** - Script automatizado de testes
- **Scale_Volunteers_API.postman_collection.json** - Collection do Postman

---

## ✅ Status dos Componentes

| Componente   | Status          | Notas                            |
| ------------ | --------------- | -------------------------------- |
| Controllers  | ✅ Completo     | Refatorado para usar services    |
| Services     | ✅ Completo     | Toda lógica de CRUD e validações |
| Repositories | ✅ Completo     | Acesso ao banco de dados         |
| Middleware   | ✅ Completo     | Autenticação e autorização       |
| Routes       | ✅ Completo     | Todas as 20+ rotas               |
| Validações   | ✅ Completo     | Regras de negócio implementadas  |
| Testes       | ⏳ Em andamento | Execute os testes agora!         |

---

## 🎯 Próximos Passos

1. Execute os testes seguindo o fluxo recomendado
2. Anote qualquer erro ou comportamento inesperado
3. Corrija os bugs conforme necessário
4. Valide todas as 27 requisições
5. Implemente qualquer funcionalidade faltante

---

**Boa sorte nos testes! 🚀**
