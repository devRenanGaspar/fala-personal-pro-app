# Integração N8N - Documentação Completa

Este documento explica como configurar e integrar o N8N com o Fala Personal para processar mensagens dos agentes de IA.

---

## 🔧 Configuração no Supabase

### 1. Configurar Webhook URL para cada Agente

No Supabase, execute o seguinte SQL para configurar o webhook de um agente:

```sql
UPDATE public.agents
SET 
  webhook_url = 'https://seu-n8n.com/webhook/seu-webhook-id',
  webhook_enabled = true,
  webhook_timeout_seconds = 300
WHERE slug = 'nicho'; -- ou qualquer outro agente
```

**Campos:**
- `webhook_url`: URL do webhook do N8N
- `webhook_enabled`: `true` para ativar, `false` para desativar
- `webhook_timeout_seconds`: Tempo máximo de espera (padrão: 300 segundos = 5 minutos)

---

## 📥 Payload Enviado ao N8N

Quando o usuário envia uma mensagem, a Edge Function `send-to-n8n` envia o seguinte payload:

```typescript
{
  // Identificadores
  "conversation_id": "uuid-v4",         // ID da conversa
  "user_id": "uuid-v4",                 // ID do usuário
  "agent_id": "uuid-v4",                // ID do agente
  
  // Mensagem atual
  "mensagem": "Qual meu público-alvo ideal?",
  
  // Mensagem inicial do agente (APENAS na primeira mensagem do usuário)
  // Permite ao N8N saber qual foi o contexto inicial da conversa
  "initial_message": "Olá! Sou seu assistente de Nicho...", // ou null se não for a primeira
  
  // Contexto - Últimas 10 mensagens da conversa
  "historico": [
    {
      "role": "user",
      "content": "Olá!",
      "created_at": "2025-01-01T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Olá! Como posso ajudar?",
      "created_at": "2025-01-01T10:00:05Z"
    }
  ],
  
  // Perfil completo do usuário (respostas do onboarding)
  "user_profile": {
    "nome": "João Silva",
    "nome_profissional": "João Personal",
    "nicho": "Emagrecimento",
    "especialidade": "HIIT",
    "publico_idade": "30-45 anos",
    "publico_genero": "Mulheres",
    "publico_objetivo": "Emagrecer",
    "objetivo_principal": "Vender mentorias",
    "posts_semanais": "3-5 vezes"
  },
  
  // Documento atual da conversa (pode ser null)
  "documento_atual": "# Nicho\n\nMeu público-alvo são...",
  
  // Metadata
  "timestamp": "2025-01-01T10:05:00Z",
  "supabase_url": "https://mmygxbfhthrlgamxbcfr.supabase.co"
}
```

---

## 📤 Resposta Esperada do N8N

O N8N deve **inserir diretamente no Supabase** a resposta do agente.

### Método 1: Inserir Mensagem via Supabase REST API (RECOMENDADO)

```http
POST https://mmygxbfhthrlgamxbcfr.supabase.co/rest/v1/messages
Headers:
  apikey: SEU_SERVICE_ROLE_KEY
  Authorization: Bearer SEU_SERVICE_ROLE_KEY
  Content-Type: application/json
  Prefer: return=minimal

Body:
{
  "conversation_id": "{{ $json.conversation_id }}",
  "role": "assistant",
  "content": "Aqui está minha resposta completa...",
  "status": "delivered"
}
```

### Método 2: Atualizar Conversa (Título e Documento)

**Renomear Conversa (apenas 1x):**

```http
PATCH https://mmygxbfhthrlgamxbcfr.supabase.co/rest/v1/conversations?id=eq.{{ $json.conversation_id }}&auto_renamed_by_n8n=eq.false
Headers:
  apikey: SEU_SERVICE_ROLE_KEY
  Authorization: Bearer SEU_SERVICE_ROLE_KEY
  Content-Type: application/json
  Prefer: return=minimal

Body:
{
  "title": "Definição de Nicho",
  "auto_renamed_by_n8n": true,
  "is_processing": false
}
```

**Atualizar Documento:**

```http
PATCH https://mmygxbfhthrlgamxbcfr.supabase.co/rest/v1/conversations?id=eq.{{ $json.conversation_id }}
Headers:
  apikey: SEU_SERVICE_ROLE_KEY
  Authorization: Bearer SEU_SERVICE_ROLE_KEY
  Content-Type: application/json
  Prefer: return=minimal

Body:
{
  "current_document": "# Nicho\n\nSeu público-alvo ideal...",
  "is_processing": false
}
```

---

## 🔐 Configurar Secrets no N8N

Você precisa criar as seguintes credenciais no N8N:

1. **SUPABASE_URL**: `https://mmygxbfhthrlgamxbcfr.supabase.co`
2. **SUPABASE_SERVICE_ROLE_KEY**: (obtido no Supabase Dashboard → Settings → API)

---

## 🎯 Exemplo de Workflow N8N (Estrutura)

```
1. Webhook Trigger
   ↓
2. Processar Lógica de IA
   - Ler: mensagem, histórico, user_profile, documento_atual
   - Gerar resposta via OpenAI / Claude / etc
   ↓
3. HTTP Request: Inserir Mensagem no Supabase
   - POST /rest/v1/messages
   - Body: { conversation_id, role: "assistant", content, status: "delivered" }
   ↓
4. (Opcional) HTTP Request: Renomear Conversa
   - PATCH /rest/v1/conversations
   - Body: { title, auto_renamed_by_n8n: true }
   ↓
5. (Opcional) HTTP Request: Atualizar Documento
   - PATCH /rest/v1/conversations
   - Body: { current_document, is_processing: false }
```

---

## ⚠️ Tratamento de Erros

Se o N8N falhar ou demorar mais que o timeout, a Edge Function automaticamente:

1. Insere mensagem de erro no banco:
   ```json
   {
     "conversation_id": "...",
     "role": "assistant",
     "content": "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
     "status": "error",
     "error_message": "Timeout after 5 minutes"
   }
   ```

2. Desmarca `is_processing` da conversa:
   ```sql
   UPDATE conversations SET is_processing = false WHERE id = '...';
   ```

---

## 📊 Fluxo Completo

```
Frontend                Edge Function           N8N                Supabase Realtime
--------                -------------           ---                -----------------
Usuário envia msg
    ↓
Mensagem aparece 
(optimistic UI)
    ↓
POST send-to-n8n ----→ Valida payload
                       Busca agente
                       Busca contexto
                       Marca is_processing=true
                           ↓
                       POST webhook_url ----→ Recebe payload
                                              Processa IA
                                                  ↓
                       Retorna queued=true     POST Supabase ----→ INSERT messages
                           ↓                   PATCH conversations   ↓
Frontend aguarda                                                  UPDATE notifica
realtime updates ←----------------------------------------------------┘
    ↓
Mensagem do agente
aparece na tela
    ↓
Documento atualizado
Título atualizado
```

---

## 🧪 Testando a Integração

1. Configure o webhook URL no agente
2. Envie uma mensagem no chat
3. Verifique os logs da Edge Function no Supabase
4. Verifique se o payload chegou no N8N
5. Verifique se a resposta foi inserida na tabela `messages`
6. Verifique se o Realtime atualizou o frontend

---

## 📝 Checklist de Implementação

- [ ] Webhook URL configurado no Supabase
- [ ] `webhook_enabled = true` no agente
- [ ] N8N configurado com `SUPABASE_SERVICE_ROLE_KEY`
- [ ] N8N insere mensagem via REST API
- [ ] N8N atualiza `is_processing = false`
- [ ] Realtime funcionando no frontend
- [ ] Testado com mensagem real

---

## 💡 Dicas

1. **Idempotência**: Use o `request_id` para evitar processar a mesma mensagem duas vezes
2. **Timeout**: Ajuste `webhook_timeout_seconds` conforme a complexidade do agente
3. **Logs**: Sempre logue o `request_id` para facilitar debug
4. **Documentação**: Mantenha exemplos de prompts e respostas no N8N
5. **Versionamento**: Use diferentes webhooks para testar novas versões do agente

---

## 🔄 Reset Automático de `is_processing`

O sistema possui múltiplas camadas de segurança para garantir que o indicador "Agente está processando" nunca fique travado:

### Camada 1: Trigger de Banco de Dados (Garantido)

Existe um trigger `on_assistant_message_reset_processing` que **automaticamente** reseta `is_processing = false` sempre que uma mensagem com `role = 'assistant'` é inserida na tabela `messages`.

**Isso significa que o N8N NÃO precisa obrigatoriamente fazer PATCH na conversa**, pois o trigger cuida disso. Porém, é recomendado manter o PATCH como boa prática.

### Camada 2: Frontend Fallback

O frontend também escuta INSERT de mensagens. Se uma mensagem do assistant chegar enquanto `isProcessing = true`, o frontend força o reset localmente.

### Camada 3: Timeout de Segurança

Se `is_processing` ficar `true` por mais de 5 minutos, o frontend automaticamente reseta para `false`.

### Ordem de Prioridade

```
1. Trigger DB (mais confiável - sempre executa)
2. N8N PATCH (boa prática - redundância)
3. Frontend INSERT listener (fallback imediato)
4. Frontend timeout (último recurso)
```

---

**Última atualização**: Janeiro 2025
