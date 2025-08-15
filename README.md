# PT RJ - Plataforma Digital

Sistema de gestão digital para o Partido dos Trabalhadores do Rio de Janeiro.

## 🚀 Funcionalidades

- **Sistema de Autenticação** com Supabase
- **Gestão de Notícias** - publicação e visualização
- **Agenda de Eventos** - criação e participação
- **Formação Política** - cursos e materiais educativos
- **Gestão de Núcleos** - organização territorial
- **Rádio PT RJ** - transmissão de conteúdo audiovisual
- **Espaço Juventude** - área específica para jovens
- **Movimentos Sociais** - organização de movimentos
- **Pontos de Cultura** - mapeamento de iniciativas
- **Boletins Semanais** - relatórios de atividades
- **Transparência** - informações públicas

## 🛠️ Tecnologias

- **Next.js 15** (React 19)
- **TypeScript**
- **Supabase** (autenticação e banco de dados)
- **Tailwind CSS** (estilização)
- **Radix UI** (componentes)
- **Lucide React** (ícones)

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm
- Conta no Supabase

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd pt-rj-app
```

2. **Instale as dependências:**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente:**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

4. **Configure o Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute os scripts SQL na pasta `scripts/` na seguinte ordem:
     - `01-create-tables.sql`
     - `02-create-policies.sql`
     - `03-create-functions.sql`

5. **Execute o projeto:**
```bash
pnpm dev
```

6. **Acesse a aplicação:**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔐 Autenticação

O sistema possui três níveis de acesso:

- **Admin**: Acesso total ao sistema
- **Coordinator**: Pode criar e gerenciar conteúdo
- **User**: Acesso básico para visualização e participação

## 📱 Uso

1. **Primeiro acesso**: Acesse `/auth/sign-up` para criar uma conta
2. **Login**: Use `/auth/login` para acessar o sistema
3. **Navegação**: Use o menu rápido na página inicial para acessar as diferentes seções

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- `profiles` - Perfis dos usuários
- `news` - Notícias e publicações
- `events` - Eventos e agenda
- `courses` - Cursos de formação
- `nucleos` - Núcleos territoriais
- `movements` - Movimentos sociais
- `youth_posts` - Posts da juventude
- `course_progress` - Progresso nos cursos

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente de produção
2. Execute `pnpm build`
3. Use `pnpm start` para iniciar o servidor de produção

## 📄 Licença

Este projeto é desenvolvido para o Partido dos Trabalhadores - Rio de Janeiro.

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento do PT RJ. 