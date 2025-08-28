##   Projeto Scale Volunteers — API de Gestão de Usuários

API desenvolvida como parte de um sistema para gerenciar voluntários em iniciativas sociais. A aplicação tem como foco a criação, autenticação e gerenciamento de usuários (CRUD), utilizando o **Prisma ORM**, **Express.js** e **Node.js**.

### ✅ Funcionalidades Implementadas

* **Cadastro de usuário (POST /usuarios)**
  Criação de novos usuários com senha criptografada.

* **Listagem de usuários (GET /usuarios)**
  Retorna todos os usuários cadastrados no sistema.

* **Busca por usuário (GET /usuarios/\:id)**
  Busca um usuário específico pelo ID.

* **Atualização de usuário (PUT /usuarios/\:id)**
  Permite alterar dados de um usuário (nome, email, tipo e senha).

* **Remoção de usuário (DELETE /usuarios/\:id)**
  Deleta um usuário do banco de dados.

### 🛠 Tecnologias Utilizadas

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT (para futuras implementações de autenticação)
* Bcrypt (para criptografia de senhas)

### 📁 Estrutura do Projeto (parcial)

```
src/
├── controllers/
│   └── userController.js
├── routes/
│   └── userRoutes.js
├── utils/
│   └── hash.js
├── index.js
```

### 📌 Próximos Passos

* Implementar login e autenticação com JWT.✅
* Adicionar validação de inputs.✅
* Criar middleware de autorização.✅
* Testes com Jest ou Insomnia/Postman.
* Documentação com Swagger.

### 📌 Organização do projeto e etapas
🔗 [TRELLO](https://trello.com/invite/b/6834ec83337d865feb1f2d60/ATTI20b18ce5cf8b767e6efaf12994aeb42c04807B3D/app-scale-volunteers)

---

