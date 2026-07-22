# Fala Personal PRO

**Plataforma SaaS de agentes de IA que ajudam Personal Trainers a produzir conteúdo e marketing digital.**

O Fala Personal PRO reúne um time de agentes de IA especializados que geram — em conversa — nicho, bio, posts, stories e mapeamento de dores/desejos do público de cada Personal Trainer. Cada agente conversa com o profissional, produz um documento versionado e permite exportar o resultado pronto para uso.

> Aplicação full-stack (SPA React + Supabase + orquestração de IA via n8n) construída como peça de portfólio.

🔗 **Demo:** https://fala-personal-pro-app.vercel.app

---

## ✨ Funcionalidades

- **5 agentes de IA especializados** — Nicho 🎯, Dores & Desejos 💭, Bio 👤, Posts 📱 e Stories 📸.
- **Chat com documento vivo** — cada conversa gera um documento editável e **versionado**, com histórico e comparação de versões.
- **Exportação** — o conteúdo gerado pode ser exportado (PDF/imagem) direto do painel.
- **Onboarding dinâmico** — perguntas configuráveis no banco personalizam as respostas dos agentes ao perfil do Personal.
- **Autenticação real** — login/cadastro via Supabase Auth, com recuperação de senha e **controle de plano** (acesso bloqueado quando o plano expira).
- **Painel administrativo** — CRUD de usuários, gestão de agentes e dashboard com métricas (usuários, mensagens, uso por período).
- **Atualizações em tempo real** — respostas dos agentes chegam ao chat via Supabase Realtime.

---

## 🧱 Stack

| Camada | Tecnologias |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 5, React Router 6 |
| **UI** | Tailwind CSS, shadcn/ui (Radix UI), lucide-react, Recharts |
| **Estado/Dados** | TanStack Query (React Query), React Hook Form + Zod |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions em Deno, Realtime, RLS) |
| **Orquestração de IA** | n8n (workflows acionados por webhooks) |

---

## 🏗️ Arquitetura

```
┌─────────────┐        ┌────────────────────┐        ┌──────────────┐
│  React SPA  │  HTTPS │  Supabase          │  POST  │  n8n         │
│  (Vite)     │───────▶│  Auth · Postgres   │───────▶│  Workflows   │
│             │        │  Edge Functions    │◀───────│  (IA/LLMs)   │
│  Realtime ◀─┼────────┤  Realtime          │  REST  │              │
└─────────────┘        └────────────────────┘        └──────────────┘
```

O frontend **não** chama LLMs diretamente. O fluxo é:

1. O usuário envia uma mensagem no chat de um agente.
2. A Edge Function `send-to-n8n` valida a sessão, confere a posse da conversa, valida a URL do webhook (proteção contra SSRF) e repassa o payload (mensagem + histórico + perfil + documento atual) ao webhook n8n daquele agente.
3. O workflow n8n processa com IA e escreve a resposta de volta no Supabase via REST.
4. O Supabase Realtime entrega a resposta ao cliente instantaneamente.

Isso mantém as chaves de IA e a lógica dos prompts **fora do repositório**, no ambiente do n8n/Supabase. Detalhes completos do contrato de integração em [`docs/N8N_INTEGRATION.md`](docs/N8N_INTEGRATION.md).

### Edge Functions (Supabase)

| Função | Responsabilidade |
|---|---|
| `send-to-n8n` | Relay principal do chat para o webhook do agente (com validação de posse e SSRF guard) |
| `send-onboarding-to-n8n` | Envia respostas de onboarding ao workflow n8n |
| `admin-users` | Lista/agrega usuários e métricas (admin) |
| `admin-create-user` | Cria usuário via service role (admin) |
| `admin-update-user` | Atualiza/bane/remove usuário e permissões (admin) |

---

## 📁 Estrutura

```
├── src/
│   ├── pages/            # Rotas (Login, Dashboard, Agent, Onboarding, Admin, ...)
│   ├── components/       # UI: admin/, agent/, dashboard/, onboarding/, ui/ (shadcn)
│   ├── contexts/         # AuthContext (sessão + perfil + plano)
│   ├── hooks/            # Hooks de dados (React Query): agents, conversations, messages...
│   ├── integrations/     # Cliente Supabase + tipos gerados
│   └── lib/              # utils, logger
├── supabase/
│   ├── functions/        # Edge Functions (Deno)
│   ├── migrations/       # Migrations SQL (schema + RLS)
│   └── config.toml
├── docs/                 # Documentação de arquitetura/integração
└── public/
```

---

## 🚀 Rodando localmente

Pré-requisitos: **Node.js 18+** e npm.

```bash
# 1. Instale as dependências
npm install

# 2. Configure o ambiente
cp .env.example .env
#   edite o .env com os dados do seu projeto Supabase

# 3. Suba o dev server (http://localhost:8080)
npm run dev
```

Scripts disponíveis:

| Comando | Ação |
|---|---|
| `npm run dev` | Ambiente de desenvolvimento (Vite) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |

### Variáveis de ambiente

Definidas em `.env` (veja `.env.example`):

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_PROJECT_ID` | Project ref do Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave anon/publishable (pública por design, protegida por RLS) |

> Segredos de servidor (service role, webhooks n8n) **não** ficam no repositório — apenas nos secrets das Edge Functions no painel do Supabase.

---

## ☁️ Deploy

O projeto é um SPA estático (Vite) e pode ser publicado em qualquer host de estáticos. Para **Vercel**:

1. Importe o repositório (preset **Vite** é detectado automaticamente: build `npm run build`, output `dist`).
2. Defina as variáveis `VITE_SUPABASE_*` no projeto.
3. O arquivo [`vercel.json`](vercel.json) já configura o *rewrite* de SPA para o roteamento client-side funcionar em qualquer rota.

O backend (Supabase + Edge Functions) e os workflows de IA (n8n) são serviços gerenciados separadamente.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.
