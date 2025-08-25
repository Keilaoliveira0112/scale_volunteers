Visão geral da aplicação

Breve explicação do propósito do sistema (gestão de voluntários/eventos, etc.).

Principais módulos (autenticação, cadastro de voluntários, gestão de eventos, etc.).

Stack Tecnológica

Node.js + Express (API)

Prisma (ORM)

PostgreSQL/MySQL (banco de dados, conforme você usar)

Outras libs (JWT, bcrypt, etc.)

Estrutura de Pastas

src/controllers → regras de negócio aplicadas

src/routes → rotas HTTP

src/middleware → autenticação, validações

src/prisma → schema e cliente do banco

docs/ → documentação

Fluxo de Requisições (diagrama simples ou em texto)
Exemplo:

Cliente → Router → Middleware (auth/validação) → Controller → Prisma → Banco


Decisões de Arquitetura

Separação entre Usuario e Voluntario (motivo: escalabilidade e papéis distintos).

Uso de middlewares para validação de regras de negócio.

Documentação centralizada em /docs.

