#!/bin/bash

# Teste completo da API Scale Volunteers
# Execute este script no terminal (bash ou PowerShell com curl)
# Certifique-se que o servidor está rodando em http://localhost:3000

BASE_URL="http://localhost:3000"

echo "🧪 Iniciando testes da API Scale Volunteers..."
echo ""

# ===== 1. REGISTRAR USUÁRIOS =====
echo "1️⃣ Registrando usuários..."

ADMIN_EMAIL="admin@example.com"
ADMIN_SENHA="senha123"

LIDER_EMAIL="lider@example.com"
LIDER_SENHA="senha123"

VOLUNTARIO_EMAIL="voluntario@example.com"
VOLUNTARIO_SENHA="senha123"

# Admin
echo "  → Registrando admin..."
ADMIN_RESP=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Admin User\",
    \"email\": \"$ADMIN_EMAIL\",
    \"senha\": \"$ADMIN_SENHA\",
    \"tipo\": \"admin\"
  }")
echo "$ADMIN_RESP" | jq .
ADMIN_ID=$(echo "$ADMIN_RESP" | jq -r '.usuario.id // empty')
echo ""

# Líder
echo "  → Registrando líder..."
LIDER_RESP=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Lider User\",
    \"email\": \"$LIDER_EMAIL\",
    \"senha\": \"$LIDER_SENHA\",
    \"tipo\": \"lider\"
  }")
echo "$LIDER_RESP" | jq .
LIDER_ID=$(echo "$LIDER_RESP" | jq -r '.usuario.id // empty')
echo ""

# Voluntário
echo "  → Registrando voluntário..."
VOLUNTARIO_RESP=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Voluntario User\",
    \"email\": \"$VOLUNTARIO_EMAIL\",
    \"senha\": \"$VOLUNTARIO_SENHA\",
    \"tipo\": \"voluntario\"
  }")
echo "$VOLUNTARIO_RESP" | jq .
VOLUNTARIO_ID=$(echo "$VOLUNTARIO_RESP" | jq -r '.usuario.id // empty')
echo ""

# ===== 2. LOGIN E OBTER TOKENS =====
echo "2️⃣ Fazendo login..."

echo "  → Login admin..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"senha\": \"$ADMIN_SENHA\"
  }")
echo "$ADMIN_LOGIN" | jq .
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.token // empty')
echo ""

echo "  → Login líder..."
LIDER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$LIDER_EMAIL\",
    \"senha\": \"$LIDER_SENHA\"
  }")
echo "$LIDER_LOGIN" | jq .
LIDER_TOKEN=$(echo "$LIDER_LOGIN" | jq -r '.token // empty')
echo ""

echo "  → Login voluntário..."
VOLUNTARIO_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$VOLUNTARIO_EMAIL\",
    \"senha\": \"$VOLUNTARIO_SENHA\"
  }")
echo "$VOLUNTARIO_LOGIN" | jq .
VOLUNTARIO_TOKEN=$(echo "$VOLUNTARIO_LOGIN" | jq -r '.token // empty')
echo ""

# ===== 3. OBTER PERFIL =====
echo "3️⃣ Obtendo perfil autenticado..."
echo "  → Perfil do admin..."
curl -s -X GET "$BASE_URL/auth/perfil" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# ===== 4. CRIAR MINISTÉRIOS (Admin) =====
echo "4️⃣ Criando ministérios..."

echo "  → Criando Ministério de Louvor..."
MINISTERIO_LOUVOR=$(curl -s -X POST "$BASE_URL/ministerios" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"nome\": \"Louvor\",
    \"descricao\": \"Ministério de louvor e adoração\"
  }")
echo "$MINISTERIO_LOUVOR" | jq .
MINISTERIO_LOUVOR_ID=$(echo "$MINISTERIO_LOUVOR" | jq -r '.ministerio.id // empty')
echo ""

echo "  → Criando Ministério de Visitação..."
MINISTERIO_VISITACAO=$(curl -s -X POST "$BASE_URL/ministerios" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"nome\": \"Visitação\",
    \"descricao\": \"Ministério de visitação aos enfermos\"
  }")
echo "$MINISTERIO_VISITACAO" | jq .
MINISTERIO_VISITACAO_ID=$(echo "$MINISTERIO_VISITACAO" | jq -r '.ministerio.id // empty')
echo ""

# ===== 5. LISTAR MINISTÉRIOS =====
echo "5️⃣ Listando ministérios..."
curl -s -X GET "$BASE_URL/ministerios" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# ===== 6. ATRIBUIR LÍDER (Admin) =====
echo "6️⃣ Atribuindo líder ao ministério..."
echo "  → Atribuindo líder ao Ministério de Louvor..."
curl -s -X POST "$BASE_URL/ministerios/$MINISTERIO_LOUVOR_ID/atribuir-lider" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"liderId\": $LIDER_ID,
    \"force\": false
  }" | jq .
echo ""

# ===== 7. ADICIONAR VOLUNTÁRIO (Líder) =====
echo "7️⃣ Adicionando voluntário ao ministério..."
echo "  → Adicionando voluntário ao Ministério de Louvor..."
ADICIONAR_VOL=$(curl -s -X POST "$BASE_URL/ministerios/$MINISTERIO_LOUVOR_ID/voluntarios" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LIDER_TOKEN" \
  -d "{
    \"voluntarioId\": $VOLUNTARIO_ID
  }")
echo "$ADICIONAR_VOL" | jq .
echo ""

# ===== 8. LISTAR VOLUNTÁRIOS DO MINISTÉRIO =====
echo "8️⃣ Listando voluntários do ministério..."
curl -s -X GET "$BASE_URL/ministerios/$MINISTERIO_LOUVOR_ID/voluntarios" \
  -H "Authorization: Bearer $LIDER_TOKEN" | jq .
echo ""

# ===== 9. APROVAR VOLUNTÁRIO (Líder) =====
echo "9️⃣ Aprovando voluntário..."
curl -s -X POST "$BASE_URL/ministerios/$MINISTERIO_LOUVOR_ID/aprovar-voluntario" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LIDER_TOKEN" \
  -d "{
    \"usuarioId\": $VOLUNTARIO_ID
  }" | jq .
echo ""

# ===== 10. CRIAR ESCALA (Admin) =====
echo "🔟 Criando escala..."
DATA_HORA=$(date -u -d "+7 days" +"%Y-%m-%dT19:00:00Z" 2>/dev/null || date -u -v+7d +"%Y-%m-%dT19:00:00Z")
echo "  → Data/Hora: $DATA_HORA"

ESCALA=$(curl -s -X POST "$BASE_URL/escalas" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"ministerioId\": $MINISTERIO_LOUVOR_ID,
    \"dataHora\": \"$DATA_HORA\",
    \"voluntarios\": [$VOLUNTARIO_ID]
  }")
echo "$ESCALA" | jq .
ESCALA_ID=$(echo "$ESCALA" | jq -r '.id // empty')
echo ""

# ===== 11. LISTAR ESCALAS =====
echo "1️⃣1️⃣ Listando escalas..."
curl -s -X GET "$BASE_URL/escalas" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# ===== 12. CONFIRMAR PRESENÇA =====
echo "1️⃣2️⃣ Confirmando presença..."
curl -s -X POST "$BASE_URL/escalas/$ESCALA_ID/confirmar-presenca" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOLUNTARIO_TOKEN" \
  -d "{
    \"voluntarioId\": $VOLUNTARIO_ID,
    \"presenteConfirmado\": true
  }" | jq .
echo ""

# ===== 13. DASHBOARD ADMIN =====
echo "1️⃣3️⃣ Dashboard Admin..."
curl -s -X GET "$BASE_URL/admin/dashboard" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "💡 IDs para referência:"
echo "  Admin ID: $ADMIN_ID | Token: $ADMIN_TOKEN"
echo "  Líder ID: $LIDER_ID | Token: $LIDER_TOKEN"
echo "  Voluntário ID: $VOLUNTARIO_ID | Token: $VOLUNTARIO_TOKEN"
echo "  Ministério Louvor ID: $MINISTERIO_LOUVOR_ID"
echo "  Ministério Visitação ID: $MINISTERIO_VISITACAO_ID"
echo "  Escala ID: $ESCALA_ID"
