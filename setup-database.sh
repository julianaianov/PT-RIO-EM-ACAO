#!/bin/bash

# Script para configurar o banco de dados do Supabase
# Execute este script para criar as tabelas, políticas e funções

echo "🚀 Configurando banco de dados do Supabase..."

# URL de conexão do Supabase (substitua pela sua URL real)
SUPABASE_URL="postgresql://postgres.fxyyrtpthgvolnkjrne:pt-rj-app@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Verificar se o psql está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ psql não está instalado. Instale o PostgreSQL client."
    exit 1
fi

echo "📋 Executando script 1: Criar Tabelas..."
psql "$SUPABASE_URL" -f scripts/01-create-tables.sql

if [ $? -eq 0 ]; then
    echo "✅ Tabelas criadas com sucesso!"
else
    echo "❌ Erro ao criar tabelas"
    exit 1
fi

echo "📋 Executando script 2: Criar Políticas de Segurança..."
psql "$SUPABASE_URL" -f scripts/02-create-policies.sql

if [ $? -eq 0 ]; then
    echo "✅ Políticas criadas com sucesso!"
else
    echo "❌ Erro ao criar políticas"
    exit 1
fi

echo "📋 Executando script 3: Criar Funções..."
psql "$SUPABASE_URL" -f scripts/03-create-functions.sql

if [ $? -eq 0 ]; then
    echo "✅ Funções criadas com sucesso!"
else
    echo "❌ Erro ao criar funções"
    exit 1
fi

echo "📋 Executando script 4: Sistema de Pontos..."
psql "$SUPABASE_URL" -f scripts/04-points-system.sql

if [ $? -eq 0 ]; then
    echo "✅ Sistema de pontos configurado com sucesso!"
else
    echo "❌ Erro ao configurar sistema de pontos"
    exit 1
fi

echo "🎉 Banco de dados configurado com sucesso!"
echo "📝 Próximos passos:"
echo "1. Configure as URLs de redirecionamento no dashboard do Supabase"
echo "2. Teste a aplicação: http://localhost:3000"
echo "3. Crie uma conta de teste" 