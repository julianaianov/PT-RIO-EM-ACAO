# Configuração do Supabase

## 🚀 Passos para Configurar o Banco de Dados

### 1. Acesse o Dashboard do Supabase

1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Acesse o projeto: `fxyyrtpthgvolnkjrne`

### 2. Execute os Scripts SQL

No dashboard do Supabase, vá para **SQL Editor** e execute os scripts na seguinte ordem:

#### Script 1: Criar Tabelas
Execute o conteúdo do arquivo `scripts/01-create-tables.sql`

#### Script 2: Criar Políticas de Segurança
Execute o conteúdo do arquivo `scripts/02-create-policies.sql`

#### Script 3: Criar Funções
Execute o conteúdo do arquivo `scripts/03-create-functions.sql`

#### Script 4: Sistema de Pontos (Opcional)
Execute o conteúdo do arquivo `scripts/04-points-system.sql`

### 3. Configurar Autenticação

1. Vá para **Authentication > Settings**
2. Configure as URLs de redirecionamento:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/`

### 4. Testar a Aplicação

1. Certifique-se de que o servidor está rodando: `pnpm dev`
2. Acesse: `http://localhost:3000`
3. Teste o cadastro de uma nova conta
4. Teste o login

## 🔧 Variáveis de Ambiente Configuradas

As seguintes variáveis já estão configuradas no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fxyyrtpthgvolnkjrne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Estrutura das Tabelas

Após executar os scripts, você terá as seguintes tabelas:

- `profiles` - Perfis dos usuários
- `news` - Notícias e publicações
- `events` - Eventos e agenda
- `courses` - Cursos de formação
- `nucleos` - Núcleos territoriais
- `movements` - Movimentos sociais
- `youth_posts` - Posts da juventude
- `course_progress` - Progresso nos cursos
- `event_participants` - Participantes de eventos
- `movement_participants` - Participantes de movimentos
- `challenge_submissions` - Submissões de desafios

## 🔐 Níveis de Acesso

O sistema possui três níveis de acesso:

- **Admin**: Acesso total ao sistema
- **Coordinator**: Pode criar e gerenciar conteúdo
- **User**: Acesso básico para visualização e participação

## 🚨 Solução de Problemas

### Erro de Autenticação
Se houver problemas com autenticação:
1. Verifique se as URLs de redirecionamento estão configuradas
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique se os scripts SQL foram executados

### Erro de Permissões
Se houver problemas de permissões:
1. Verifique se as políticas (policies) foram criadas
2. Confirme se as funções (functions) foram executadas

## 📞 Suporte

Se precisar de ajuda, verifique:
1. Os logs do servidor Next.js
2. Os logs do Supabase
3. O console do navegador para erros JavaScript 