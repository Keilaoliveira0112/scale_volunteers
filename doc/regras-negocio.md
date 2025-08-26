📜 Regras de Negócio - Sistema de Gestão de Voluntários

Apenas Administradores Podem Listar Usuários

- **Descrição:** Apenas usuários com a role `ADMIN` podem acessar a rota de listagem de usuários.

- **Rota:** `GET /admin/listar-usuarios`
- **Middleware:** `verificarToken`, `authorizeAdmin`
- **Resposta de Erro:**
  - `403`: Caso o usuário não seja administrador.
  - `401`: Caso o token seja inválido ou ausente.
  
- **Objetivo:** Garantir que apenas administradores gerenciem contas.

🔹 Usuário
- O e-mail do usuário deve ser **único** no sistema. 

- A senha deve ter **mínimo de 8 caracteres**. - O nome é **obrigatório**. 

- O usuário só pode ser criado com uma conta de **e-mail válido**

Um Usuário pode ter um ou mais papéis (ADMIN, LIDER, VOLUNTARIO).

Autenticação 

- Apenas usuários cadastrados podem acessar rotas protegidas. 

- O token JWT tem validade de **1 hora**.

Usuário do tipo ADMIN pode:

Criar, editar e remover ministérios.

Atribuir líderes e voluntários a ministérios.

Definir escala de atividades.

Usuário do tipo LIDER pode:

Aprovar entrada de voluntários em seu ministério.

Criar escalas apenas no ministério que lidera.

Validar presença de voluntários.

Usuário do tipo VOLUNTARIO pode:

Solicitar ingresso em até 2 ministérios.

Confirmar presença nas escalas em que for designado.

🔹 Ministério

Um ministério pode ter apenas 1 líder.

Um ministério pode ter vários voluntários.

Um ministério não pode ser excluído se tiver escalas ativas vinculadas.

🔹 Escala

Cada escala deve estar associada a um único ministério.

Um voluntário só pode ser escalado se pertencer ao ministério.

Um voluntário não pode estar em duas escalas diferentes no mesmo dia/horário.

A confirmação de presença deve ser feita até 48h antes da data da escala.

Somente ADMIN e LIDER podem criar escalas.

🔹 Validações Gerais

Antes de inserir um voluntário em um ministério, validar se ele já participa de até 2 ministérios.

Antes de escalar voluntário, validar se não existe conflito de data/horário.

Antes de excluir ministério, validar se não há escalas ativas.

Ao cadastrar usuário, validar se e-mail é único.

🔹 Fluxos Principais
📌 Fluxo de Cadastro de Voluntário

Usuário cria conta como VOLUNTARIO.

Solicita ingresso em até 2 ministérios.

Líder aprova ou rejeita a solicitação.

📌 Fluxo de Cadastro de Ministério

Usuário ADMIN cria ministério.

Atribui 1 usuário como líder.

Voluntários podem solicitar ingresso.

📌 Fluxo de Criação de Escala

Usuário ADMIN ou LIDER cria escala vinculada a ministério.

Seleciona voluntários disponíveis.

Sistema valida conflitos de data/horário.

Voluntário recebe notificação e confirma presença até 48h antes.

🔹 Futuras Regras (Escalabilidade)

Controle de hierarquia de líderes (sub-líderes).

Registro de frequência histórica dos voluntários.

Relatórios de participação por ministério.

Sistema de pontuação/recompensas para engajamento.