#!/bin/bash

# Script para configurar o banco de dados do Supabase usando a API REST

echo "🚀 Configurando banco de dados do Supabase via API..."

# Configurações do Supabase
SUPABASE_URL="https://fxyyrtpthgvolnkjrne.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4eXlydHB0aGd2b2xua25qcm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDIxMzEsImV4cCI6MjA3MDY3ODEzMX0.-dQhBXkgfFWdoO2uG3NyJVsCfmzPYgm492yw3Olc4Jw"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4eXlydHB0aGd2b2xua25qcm5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTEwMjEzMSwiZXhwIjoyMDcwNjc4MTMxfQ.ySSqC2km_qc8eOH-TQXG3uag2e7XeLG1Sxhpc_GKYLA"

# Função para executar SQL via API
execute_sql() {
    local sql_file=$1
    local description=$2
    
    echo "📋 Executando: $description"
    
    # Ler o conteúdo do arquivo SQL
    local sql_content=$(cat "$sql_file")
    
    # Executar via API REST (usando rpc para executar SQL)
    response=$(curl -s -X POST \
        -H "apikey: $SUPABASE_SERVICE_KEY" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"$sql_content\"}" \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql")
    
    if [ $? -eq 0 ]; then
        echo "✅ $description executado com sucesso!"
    else
        echo "❌ Erro ao executar $description"
        echo "Resposta: $response"
    fi
}

# Verificar se o curl está instalado
if ! command -v curl &> /dev/null; then
    echo "❌ curl não está instalado."
    exit 1
fi

echo "🔧 Tentando executar os scripts SQL..."

# Tentar executar cada script
execute_sql "scripts/01-create-tables.sql" "Criar Tabelas"
execute_sql "scripts/02-create-policies.sql" "Criar Políticas"
execute_sql "scripts/03-create-functions.sql" "Criar Funções"
execute_sql "scripts/04-points-system.sql" "Sistema de Pontos"

echo "🎉 Processo concluído!"
echo "📝 Nota: Se houver erros, você pode precisar executar os scripts manualmente no dashboard do Supabase" 