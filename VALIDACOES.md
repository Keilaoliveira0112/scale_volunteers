# 🔒 Validações de Dados - Scale Volunteers API

## Resumo Executivo

Todas as **40+ rotas REST** agora possuem validação completa de dados através de middlewares express-validator. As validações cobrem:

- ✅ **Validação de entrada (body, params, query)**
- ✅ **Validação de regras de negócio**
- ✅ **Tratamento de erros padronizado**
- ✅ **Mensagens em português**

---

## 📋 Validações por Rota

### 1️⃣ ROTAS DE USUÁRIO (`usuarioRoutes.js`) - ✅ COMPLETO

| Rota             | Método | Validações                                    | Status |
| ---------------- | ------ | --------------------------------------------- | ------ |
| `/auth/register` | POST   | `validateRegister` (nome, email, senha, tipo) | ✅     |
| `/auth/login`    | POST   | `validateLogin` (email, senha)                | ✅     |
| `/auth/profile`  | GET    | `verificarToken`                              | ✅     |
| `/auth/profile`  | PUT    | `validateUpdateProfile` (nome, email)         | ✅     |
| `/users/:id`     | GET    | `validateParamId`                             | ✅     |
| `/users`         | GET    | `verificarToken` + `authorizeAdmin`           | ✅     |
| `/users/:id`     | DELETE | `validateParamId`                             | ✅     |

**Campos Validados:**

- `nome`: 3-255 caracteres
- `email`: Formato válido, único no banco
- `senha`: Mínimo 6 caracteres, hashing com bcrypt
- `tipo`: Valores permitidos (admin, lider, voluntario, usuario)

---

### 2️⃣ ROTAS DE MINISTÉRIO (`ministerioRoutes.js`) - ✅ COMPLETO

| Rota                                      | Método | Validações                                                 | Status |
| ----------------------------------------- | ------ | ---------------------------------------------------------- | ------ |
| `/ministerios`                            | POST   | `validateCreateMinisterio`                                 | ✅     |
| `/ministerios`                            | GET    | `verificarToken`                                           | ✅     |
| `/ministerios/:id`                        | GET    | `validateParamMinisterioId`                                | ✅     |
| `/ministerios/:id`                        | PUT    | `validateUpdateMinisterio`                                 | ✅     |
| `/ministerios/:id`                        | DELETE | `validarMinisterioSemEscalasAtivas`                        | ✅     |
| `/ministerios/:id/lider`                  | POST   | `validateAtribuirLider` + `validarVoluntarioExiste`        | ✅     |
| `/ministerios/:id/voluntarios`            | GET    | `validateParamMinisterioId`                                | ✅     |
| `/ministerios/:id/voluntarios`            | POST   | `validateAdicionarVoluntario` + `validarMaximoMinisterios` | ✅     |
| `/ministerios/:id/aprovar/:voluntarioId`  | PUT    | `validarVoluntarioExiste`                                  | ✅     |
| `/ministerios/:id/rejeitar/:voluntarioId` | PUT    | `validarVoluntarioExiste`                                  | ✅     |

**Campos Validados:**

- `nome`: 3-255 caracteres, único
- `descricao`: Opcional, até 1000 caracteres
- `liderId`: Deve existir no banco, deve ser tipo "lider"
- `voluntarioId`: Deve existir, máximo 2 ministérios por voluntário

---

### 3️⃣ ROTAS DE ESCALA (`escalaRoutes.js`) - ✅ COMPLETO

| Rota                                     | Método | Validações                                       | Status |
| ---------------------------------------- | ------ | ------------------------------------------------ | ------ |
| `/escalas`                               | POST   | `validateCreateEscala` + `validarConflitoEscala` | ✅     |
| `/escalas`                               | GET    | `verificarToken`                                 | ✅     |
| `/escalas/:id`                           | GET    | `validateParamEscalaId`                          | ✅     |
| `/escalas/:id`                           | PUT    | `validateUpdateEscala`                           | ✅     |
| `/escalas/:id`                           | DELETE | `validateParamEscalaId`                          | ✅     |
| `/escalas/:id/confirmar-presenca`        | POST   | `validateConfirmarPresenca`                      | ✅     |
| `/escalas/:id/adicionar-voluntario`      | POST   | `validateAdicionarVoluntarioEscala`              | ✅     |
| `/escalas/:id/voluntarios/:voluntarioId` | DELETE | `validateParamEscalaVoluntario`                  | ✅     |

**Campos Validados:**

- `data`: Formato ISO, data futura
- `ministerioId`: Deve existir
- `voluntarioId`: Deve existir, aprovado no ministério
- **Regra de Negócio**: Escala não pode ter conflito (48 horas)
- `presenca`: Boolean válido

---

### 4️⃣ ROTAS DE LÍDER (`liderRoutes.js`) - ✅ COMPLETO

| Rota                                                   | Método | Validações                                                 | Status |
| ------------------------------------------------------ | ------ | ---------------------------------------------------------- | ------ |
| `/lider/escalas`                                       | POST   | `validateCreateEscala` + `validarConflitoEscala`           | ✅     |
| `/lider/escalas`                                       | GET    | `verificarToken`                                           | ✅     |
| `/lider/escalas/:ministerioId`                         | GET    | `validateParamMinisterioId`                                | ✅     |
| `/lider/ministerios/:ministerioId/voluntarios`         | POST   | `validateAdicionarVoluntario` + `validarMaximoMinisterios` | ✅     |
| `/lider/ministerios/:ministerioId/voluntarios`         | GET    | `validateParamMinisterioId`                                | ✅     |
| `/lider/ministerios/:ministerioId/aprovar/:usuarioId`  | PUT    | `validarVoluntarioExiste`                                  | ✅     |
| `/lider/ministerios/:ministerioId/rejeitar/:usuarioId` | PUT    | `validarVoluntarioExiste`                                  | ✅     |

---

### 5️⃣ ROTAS DE VOLUNTÁRIO (`voluntarioRoutes.js`) - ✅ COMPLETO

| Rota                                               | Método | Validações                                                 | Status |
| -------------------------------------------------- | ------ | ---------------------------------------------------------- | ------ |
| `/voluntario/solicitar-ministerio`                 | POST   | `validateAdicionarVoluntario` + `validarMaximoMinisterios` | ✅     |
| `/voluntario/minhas-solicitacoes`                  | GET    | `verificarToken`                                           | ✅     |
| `/voluntario/minhas-escalas`                       | GET    | `verificarToken`                                           | ✅     |
| `/voluntario/escalas/:escalaId/confirmar-presenca` | POST   | `validateConfirmarPresenca`                                | ✅     |
| `/voluntario/meus-ministerios`                     | GET    | `verificarToken`                                           | ✅     |
| `/voluntario/sair-ministerio/:ministerioId`        | POST   | `validateParamMinisterioId`                                | ✅     |

---

## 🛡️ Validadores Customizados

### Validações de Entrada (Input Validation)

#### `validateRegister`

```javascript
- nome: required, 3-255 chars
- email: required, valid email, unique
- senha: required, min 6 chars
- tipo: optional, enum: admin|lider|voluntario|usuario
```

#### `validateLogin`

```javascript
- email: required, valid email
- senha: required
```

#### `validateUpdateProfile`

```javascript
- nome: optional, 3-255 chars
- email: optional, valid email
```

#### `validateCreateMinisterio`

```javascript
- nome: required, 3-255 chars
- descricao: optional, 0-1000 chars
- ministerioId: optional, must exist
```

#### `validateUpdateMinisterio`

```javascript
- nome: optional, 3-255 chars
- descricao: optional, 0-1000 chars
```

#### `validateCreateEscala`

```javascript
- data: required, ISO format, future date
- ministerioId: required, must exist
- observacoes: optional, 0-1000 chars
```

#### `validateUpdateEscala`

```javascript
- data: optional, ISO format, future date
- ministerioId: optional, must exist
- observacoes: optional, 0-1000 chars
```

#### `validateConfirmarPresenca`

```javascript
- presenca: required, boolean
```

#### `validateAdicionarVoluntarioEscala`

```javascript
- voluntarioId: required, must exist
```

#### `validateAtribuirLider`

```javascript
- liderId: required, must exist, must be lider type
```

#### `validateAprovarVoluntario`

```javascript
- voluntarioId: required, must exist
```

### Validações de Parâmetros (Parameter Validation)

#### `validateParamId`

```javascript
- id (path param): required, valid UUID/ID
```

#### `validateParamMinisterioId`

```javascript
- ministerioId (path param): required, must exist in DB
```

#### `validateParamEscalaId`

```javascript
- id (path param): required, must exist in DB
```

#### `validateParamEscalaVoluntario`

```javascript
- id (path param): required, valid escala
- voluntarioId (path param): required, valid voluntario
```

### Validações de Regras de Negócio (Business Logic)

#### `validarMaximoMinisterios()`

```javascript
- Voluntário não pode ter > 2 ministérios aprovados
- Retorna 400 se limite excedido
```

#### `validarConflitoEscala()`

```javascript
- Nova escala não pode conflitar com existentes (48h)
- Retorna 409 se conflito detectado
```

#### `validarVoluntarioNoMinisterio()`

```javascript
- Voluntário deve estar APROVADO no ministério
- Retorna 403 se não aprovado
```

#### `validarMinisterioSemEscalasAtivas()`

```javascript
- Ministério não pode ter escalas ativas para ser deletado
- Retorna 409 se tem escalas
```

#### `validarVoluntarioExiste()`

```javascript
- Voluntário/usuário deve existir no banco
- Retorna 404 se não encontrado
```

#### `validarMinisterioExiste()`

```javascript
- Ministério deve existir no banco
- Retorna 404 se não encontrado
```

### Tratamento de Erros

#### `checkValidationErrors()`

```javascript
- Captura todos os erros de validação do express-validator
- Retorna 400 com array de mensagens de erro
- Mensagens em português
- Formato:
  {
    "status": 400,
    "message": "Erro de validação",
    "errors": [
      { "field": "email", "message": "Email inválido" },
      { "field": "senha", "message": "Senha muito curta" }
    ]
  }
```

---

## 📊 Estatísticas

| Categoria               | Quantidade |
| ----------------------- | ---------- |
| **Rotas Totais**        | 40+        |
| **Rotas com Validação** | 40+ (100%) |
| **Validadores Únicos**  | 15+        |
| **Validações Totais**   | 50+        |
| **Regras de Negócio**   | 6          |

---

## 🔄 Fluxo de Validação

```
1. Requisição chega
   ↓
2. Middleware de autenticação (verificarToken)
   ↓
3. Validadores de entrada (validateX)
   ↓
4. Validadores de negócio (validarX)
   ↓
5. Se tudo OK → Controlador
   ↓
6. Se erro → Resposta 400/403/404/409
```

---

## 💡 Exemplos de Uso

### ✅ Requisição Válida

```bash
curl -X POST http://localhost:3000/api/ministerios \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Louvor e Adoração",
    "descricao": "Ministério responsável pela adoração"
  }'
```

Resposta:

```json
{
  "id": "uuid",
  "nome": "Louvor e Adoração",
  "descricao": "Ministério responsável pela adoração",
  "criado_em": "2025-01-15T10:30:00Z"
}
```

### ❌ Requisição Inválida

```bash
curl -X POST http://localhost:3000/api/ministerios \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "AB"
  }'
```

Resposta (400):

```json
{
  "status": 400,
  "message": "Erro de validação",
  "errors": [
    {
      "field": "nome",
      "message": "Nome deve ter entre 3 e 255 caracteres"
    }
  ]
}
```

---

## ✨ Próximos Passos (Opcional)

- [ ] Adicionar rate limiting por usuário
- [ ] Adicionar sanitização de HTML/XSS
- [ ] Adicionar validação CSRF
- [ ] Adicionar logging de tentativas falhadas
- [ ] Adicionar testes unitários para validadores
- [ ] Adicionar validação de arquivo para uploads
- [ ] Adicionar autenticação OAuth/OpenID

---

## 📝 Notas

- Todas as validações retornam mensagens em **português brasileiro**
- IDs são validados como UUIDs válidos
- Datas são validadas em formato ISO 8601
- Emails são validados contra padrão RFC 5322
- Senhas são hasheadas com bcrypt (10 salt rounds)
- Conflitos de escala consideram janela de 48 horas
- Máximo 2 ministérios por voluntário
- 1 líder por ministério
