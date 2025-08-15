#!/bin/bash

# Script para configurar o banco de dados do Supabase
# Abre o dashboard e mostra as instruções

echo "🚀 Configurando banco de dados do Supabase..."
echo ""
echo "📋 Siga estes passos:"
echo ""
echo "1. 🌐 Abrindo o dashboard do Supabase..."
echo "   URL: https://supabase.com/dashboard/project/fxyyrtpthgvolnkjrne"
echo ""

# Tentar abrir o navegador (funciona no macOS e Linux)
if command -v open &> /dev/null; then
    open "https://supabase.com/dashboard/project/fxyyrtpthgvolnkjrne"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://supabase.com/dashboard/project/fxyyrtpthgvolnkjrne"
else
    echo "   Abra manualmente: https://supabase.com/dashboard/project/fxyyrtpthgvolnkjrne"
fi

echo "2. 📝 No dashboard, vá para SQL Editor"
echo ""
echo "3. 🔧 Execute os scripts na seguinte ordem:"
echo "   a) Copie e cole o conteúdo de: scripts/01-create-tables.sql"
echo "   b) Copie e cole o conteúdo de: scripts/02-create-policies.sql"
echo "   c) Copie e cole o conteúdo de: scripts/03-create-functions.sql"
echo "   d) Copie e cole o conteúdo de: scripts/04-points-system.sql"
echo ""
echo "4. ⚙️ Configure as URLs de redirecionamento:"
echo "   Vá para Authentication > Settings"
echo "   Adicione estas URLs:"
echo "   - http://localhost:3000/auth/callback"
echo "   - http://localhost:3000/"
echo ""
echo "5. ✅ Teste a aplicação:"
echo "   - Acesse: http://localhost:3000"
echo "   - Crie uma conta de teste"
echo "   - Faça login"
echo ""

echo "📋 Conteúdo dos scripts SQL:"
echo "================================"

echo ""
echo "📄 Script 1 - Criar Tabelas:"
echo "================================"
cat scripts/01-create-tables.sql

echo ""
echo "📄 Script 2 - Criar Políticas:"
echo "================================"
cat scripts/02-create-policies.sql

echo ""
echo "📄 Script 3 - Criar Funções:"
echo "================================"
cat scripts/03-create-functions.sql

echo ""
echo "📄 Script 4 - Sistema de Pontos:"
echo "================================"
cat scripts/04-points-system.sql

echo ""
echo "🎉 Instruções completas!"
echo "📝 Agora você pode copiar e colar os scripts no SQL Editor do Supabase" 