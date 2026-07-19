-- Popular banco com dados de teste para personal trainer "Renan Oliveira"
-- User ID: 68b69c96-d6b5-4e0f-a70e-25b140203bcc

-- 1. CRIAR CONVERSAS FALTANTES (bio, posts, stories)
INSERT INTO conversations (id, user_id, agent_id, title, current_document, created_at, updated_at)
VALUES
  -- Bio
  ('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', '68b69c96-d6b5-4e0f-a70e-25b140203bcc', '45965454-0db5-4e6a-a0c1-c168a7ea90f5', 'Conversa - Bio Profissional', 
  '# Bio Instagram - Versão Final

**Bio Principal (145 caracteres):**
🏋️ Personal há 8 anos | Especialista em emagrecimento feminino
💪 Treinos flex para mães ocupadas
📍 São Paulo • Online
👇 Comece sua transformação

**Variação 2 - Foco em Resultado:**
Personal trainer especializado em emagrecimento saudável para mulheres 30-45 anos. Método comprovado que se encaixa na sua rotina. Vagas limitadas para mentoria online.

**Variação 3 - Tom Motivacional:**
Já ajudei +200 mulheres a emagrecerem sem dietas radicais. Treinos que cabem na sua agenda de mãe e profissional. Sua melhor versão começa aqui.

**Sugestões de CTA:**
- 📱 Link na bio: "Agende sua avaliação gratuita"
- 🎯 "Clique para conhecer o método"
- 💬 "Chama no direct"

**Emojis Estratégicos:**
🏋️ (treino) • 💪 (força) • 🔥 (resultados) • 📍 (localização) • 👇 (CTA) • ⚡ (energia) • ✨ (transformação)', 
  NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days'),
  
  -- Posts
  ('c2d3e4f5-a6b7-5c8d-9e0f-1a2b3c4d5e6f', '68b69c96-d6b5-4e0f-a70e-25b140203bcc', '18b81b41-0ff6-411f-b5b5-11c34f5b5190', 'Conversa - Posts para Instagram',
  '# Post Carrossel - 5 Erros que Impedem Seu Emagrecimento

**Tipo:** Carrossel educativo (8 slides)

**Gancho (Slide 1):**
"Você treina, mas não emagrece? 
Estes 5 erros estão sabotando seus resultados 👇"

**Slide 2 - Erro #1:**
❌ PULAR REFEIÇÕES
Desacelera metabolismo e gera compulsão alimentar. Coma de 3 em 3 horas!

**Slide 3 - Erro #2:**
❌ TREINAR SEM PLANEJAMENTO
Treino aleatório = resultado aleatório. Você precisa de periodização inteligente.

**Slide 4 - Erro #3:**
❌ DORMIR MENOS DE 7H
Sono ruim = cortisol alto = barriga inchada. Recuperação acontece durante o sono.

**Slide 5 - Erro #4:**
❌ FOCAR SÓ NO CARDIO
Musculação acelera metabolismo 24h por dia. Cardio queima calorias só durante.

**Slide 6 - Erro #5:**
❌ NÃO TER ACOMPANHAMENTO
Treinar sozinha é como dirigir sem GPS. Personal te guia e acelera resultados.

**Slide 7 - CTA:**
Quer um plano personalizado para seus objetivos?
📩 Manda DM que te explico como funciona meu método

**Slide 8 - Encerramento:**
Salva este post e compartilha com aquela amiga que precisa ler isso! 💪

**Hashtags:**
#emagrecimento #personalonline #treino #fitness #saude #bemestar #dicasdetreino #emagrecersaudavel #mulheresquetreinam #motivacao

**Sugestões Visuais:**
- Fundo gradiente laranja/vermelho
- Ícones minimalistas para cada erro
- Tipografia bold para títulos
- Paleta: preto, branco, laranja', 
  NOW() - INTERVAL '18 days', NOW() - INTERVAL '5 days'),
  
  -- Stories
  ('d3e4f5a6-b7c8-6d9e-0f1a-2b3c4d5e6f7a', '68b69c96-d6b5-4e0f-a70e-25b140203bcc', 'ac749289-54a6-47bf-89e4-7733902112d5', 'Conversa - Stories Diários',
  '# Série de Stories - A Importância da Hidratação

**Objetivo:** Educar sobre hidratação e seu papel no emagrecimento

---

**Story 1 - Gancho**
📱 Texto: "Você bebe água suficiente? A maioria das minhas alunas descobre que NÃO ⬇️"
🎨 Visual: Foto sua segurando garrafa de água
💬 Interação: Caixinha de perguntas "Quantos litros você bebe por dia?"

**Story 2 - Problema**
📱 Texto: "Desidratação pode estar SABOTANDO seu emagrecimento:
• Metabolismo lento ❌
• Retenção de líquido ❌  
• Fome falsa ❌
• Cansaço excessivo ❌"
🎨 Visual: Lista com X vermelho em cada item
💬 Interação: Enquete "Você sente esses sintomas? SIM | NÃO"

**Story 3 - Solução**
📱 Texto: "Quanto você REALMENTE precisa beber?
🔢 Fórmula: Seu peso x 35ml
Ex: 70kg = 2,45 litros por dia"
🎨 Visual: Calculadora ou infográfico colorido
💬 Interação: Quiz "Você bebe essa quantidade? SEMPRE | ÀS VEZES | NUNCA"

**Story 4 - Dica Prática**
📱 Texto: "HACK para beber mais água:
⏰ Defina alarmes de 2 em 2h
📱 Use apps de hidratação
🍋 Adicione limão/gengibre
❄️ Mantenha garrafa sempre visível"
🎨 Visual: Print de app ou foto da sua garrafa
💬 Interação: "Qual dica você vai testar primeiro?"

**Story 5 - Transformação**
📱 Texto: "O que melhora quando você se hidrata:
✅ Pele mais bonita
✅ Menos inchaço
✅ Mais energia
✅ Digestão melhor
✅ Resultados no treino"
🎨 Visual: Before/after discreto ou gráfico de benefícios
💬 Interação: "Reaja com 🔥 se isso te motivou"

**Story 6 - CTA Final**
📱 Texto: "Quer um plano completo de treino + alimentação personalizado?
📩 Me chama no direct!"
🎨 Visual: Sua foto sorrindo + seta para cima (direct)
💬 Interação: Link ou GIF animado', 
  NOW() - INTERVAL '12 days', NOW() - INTERVAL '1 day');

-- 2. ATUALIZAR CONVERSAS EXISTENTES (nicho e dores-desejos)
UPDATE conversations 
SET current_document = '# Definição de Nicho - Renan Oliveira Personal

## Público-Alvo Ideal

**Demografia:**
- Mulheres entre 30-45 anos
- Casadas ou em relacionamento sério
- Mães de 1-2 filhos (4-12 anos)
- Profissionais ativas (CLT ou empreendedoras)
- Classe B/C+
- Região: São Paulo e Grande SP (presencial) + Brasil todo (online)

**Perfil Comportamental:**
- Rotina intensa: trabalho + casa + filhos
- Tentaram emagrecer várias vezes sem sucesso duradouro
- Já fizeram dietas restritivas que não funcionaram
- Sentem culpa por não priorizar a saúde
- Buscam praticidade e eficiência
- Valorizam profissionalismo e acompanhamento próximo

## Objetivo Principal do Público

"Emagrecer de forma saudável e sustentável, sem abrir mão da rotina familiar e profissional, recuperando autoestima e energia para viver plenamente"

## Características Principais

✅ **Foco Específico:** Emagrecimento feminino 30-45 anos  
✅ **Abordagem:** Treinos flexíveis que se adaptam à rotina (20-40 min)  
✅ **Método:** Periodização personalizada + acompanhamento semanal  
✅ **Diferenciais:** Personal que entende a realidade de mães ocupadas  
✅ **Formato:** Online (maior alcance) e presencial (SP - vagas limitadas)

## Diferencial Competitivo (Método FLEX)

**Por que escolher o método FLEX?**

1. **Treinos Inteligentes:** 20-40 minutos de duração, alta eficiência
2. **Flexibilidade Real:** Ajustes semanais conforme sua disponibilidade
3. **Suporte Constante:** Grupo VIP no WhatsApp + check-ins semanais
4. **Sem Radicalismo:** Alimentação equilibrada, sem dietas malucas
5. **Resultados Comprovados:** Mais de 200 mulheres transformadas

**Posicionamento:**
"O personal trainer que entende que você tem uma vida corrida e te ajuda a emagrecer sem abrir mão do que importa"',
    updated_at = NOW() - INTERVAL '3 days'
WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' 
  AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

UPDATE conversations 
SET current_document = '# Dores, Objeções e Desejos do Público-Alvo

## 🔴 TOP 5 DORES PRINCIPAIS

### 1. Frustração com Resultados Temporários
"Já emagreci várias vezes, mas sempre volto a engordar. Parece que meu corpo não responde mais a nada."
- Efeito sanfona destrói autoestima
- Sensação de fracasso pessoal
- Medo de tentar de novo e falhar

### 2. Falta de Tempo e Energia
"Acordo, trabalho, cuido dos filhos, faço janta... quando sobra tempo, só quero descansar."
- Rotina exaustiva sem espaço para si mesma
- Culpa por não priorizar a saúde
- Academia vista como "mais uma obrigação"

### 3. Desconforto com o Próprio Corpo
"Não me reconheço mais no espelho. Minhas roupas não servem e me sinto velha aos 38 anos."
- Autoestima baixa afeta relacionamento e vida social
- Evita fotos e eventos sociais
- Sensação de ter "perdido a beleza"

### 4. Tentativas Frustradas com Dietas Radicais
"Já tentei detox, low carb, jejum... passo fome, fico irritada e no final desisto."
- Dietas insustentáveis geram compulsão alimentar
- Relação conflituosa com comida
- Não sabe o que realmente funciona

### 5. Sobrecarga e Falta de Suporte
"Cuido de todo mundo, mas ninguém me apoia quando eu quero cuidar de mim."
- Família não valoriza esforço dela
- Marido/filhos não ajudam em casa
- Sensação de solidão na jornada

---

## 🚫 TOP 3 OBJEÇÕES COMUNS

### 1. "Não tenho tempo para treinar"
**Crença por trás:** Academia exige 1-2h por dia
**Realidade:** Treinos eficientes de 20-30 min bastam
**Como quebrar:** Mostrar exemplos de clientes com rotina igual/pior que conseguiram

### 2. "Personal é muito caro"
**Crença por trás:** É luxo, não investimento
**Realidade:** Gasta mais com tentativas que não funcionam (dietas, apps, academias)
**Como quebrar:** Mostrar ROI - saúde, autoestima, roupas que voltam a servir

### 3. "Já tentei e não funciona comigo"
**Crença por trás:** Seu corpo é diferente/problemático
**Realidade:** Métodos errados ou falta de personalização
**Como quebrar:** Depoimentos de mulheres "impossíveis" que conseguiram

---

## ✨ TOP 5 DESEJOS/SONHOS

### 1. Caber Nas Roupas Antigas
"Quero voltar a usar aquele vestido lindo que comprei na lua de mel"
💭 Desejo de recuperar versão passada de si mesma

### 2. Ter Energia e Disposição
"Quero brincar com meus filhos sem ficar cansada, acordar animada"
💭 Desejo de vitalidade e qualidade de vida

### 3. Sentir-se Bonita e Desejada
"Quero que meu marido olhe para mim como antigamente. Quero me sentir sexy de novo"
💭 Desejo de reconquistar feminilidade e atratividade

### 4. Ser Exemplo para os Filhos
"Quero que meus filhos vejam que a mãe cuida da saúde, que isso é importante"
💭 Desejo de ser referência positiva

### 5. Provar para Si Mesma que É Capaz
"Quero provar que EU consigo, que não sou fraca ou sem força de vontade"
💭 Desejo de autoconquista e superação pessoal

---

## 🎯 GATILHOS EMOCIONAIS PODEROSOS

🔥 **Urgência:** "Seus filhos estão crescendo - você quer ter energia para aproveitar cada fase?"  
💔 **Dor da perda:** "Cada ano que passa fica mais difícil emagrecer. Não deixe para depois."  
🏆 **Prova social:** "Mais de 200 mães já transformaram o corpo e a vida. Por que você seria diferente?"  
⚡ **Transformação rápida:** "Resultados visíveis em 21 dias com apenas 25 min/dia"  
❤️ **Empoderamento:** "Você merece se sentir bonita, forte e confiante. Não é egoísmo, é autocuidado"',
    updated_at = NOW() - INTERVAL '1 day'
WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' 
  AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

-- 3. INSERIR MENSAGENS DE CHAT

-- Nicho (conversation já existe)
INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'user', 'Preciso definir melhor meu nicho. Atendo principalmente mulheres, mas não sei se estou sendo específico o suficiente.', NOW() - INTERVAL '30 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'assistant', 'Ótimo que você percebeu isso! Vamos refinar seu posicionamento. Me conta: qual faixa etária predomina entre suas clientes? E qual o principal objetivo delas quando te procuram?', NOW() - INTERVAL '30 days' + INTERVAL '5 minutes'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'user', 'A maioria tem entre 30-45 anos, são mães e profissionais ocupadas. O objetivo principal é emagrecimento, mas elas sempre falam que não têm tempo.', NOW() - INTERVAL '30 days' + INTERVAL '10 minutes'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'assistant', 'Perfeito! Esse é um nicho muito claro e valioso. Criei uma definição completa de nicho focada em mulheres 30-45 anos, mães e profissionais ocupadas que buscam emagrecimento. O diferencial do seu método FLEX é justamente a flexibilidade que se encaixa na rotina delas. Dei uma olhada no documento - o que acha?', NOW() - INTERVAL '30 days' + INTERVAL '12 minutes'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'user', 'Ficou muito bom! Mas acho que preciso reforçar mais o "método FLEX" como diferencial. Pode ajustar?', NOW() - INTERVAL '29 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'assistant', 'Pronto! Adicionei uma seção específica sobre o Método FLEX com os 5 diferenciais principais: treinos inteligentes de 20-40min, flexibilidade real com ajustes semanais, suporte constante via WhatsApp, alimentação sem radicalismo, e resultados comprovados com +200 mulheres. O posicionamento ficou: "O personal trainer que entende que você tem uma vida corrida e te ajuda a emagrecer sem abrir mão do que importa". Confere aí!', NOW() - INTERVAL '29 days' + INTERVAL '3 minutes'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

-- Dores & Desejos
INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'user', 'Agora que defini meu nicho, preciso entender profundamente as dores do meu público para criar conteúdo que realmente conecte.', NOW() - INTERVAL '20 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'assistant', 'Excelente! Vou te ajudar a mapear as dores mais profundas. Me conta: qual a reclamação #1 que você mais ouve das suas clientes quando elas chegam até você?', NOW() - INTERVAL '20 days' + INTERVAL '2 minutes'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'user', 'Elas dizem que já tentaram emagrecer várias vezes, fazem dieta maluca, passam fome, mas depois voltam tudo de novo. E também falam muito sobre falta de tempo.', NOW() - INTERVAL '20 days' + INTERVAL '8 minutes'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'assistant', 'Perfeito! Identifiquei 5 dores principais: efeito sanfona e frustração, falta de tempo/energia, desconforto com próprio corpo, tentativas frustradas com dietas radicais, e sobrecarga sem suporte familiar. Também mapeei 3 objeções comuns ("não tenho tempo", "é caro", "já tentei e não funciona") e 5 desejos profundos (caber nas roupas antigas, ter energia, sentir-se desejada, ser exemplo, provar capacidade). Tudo com gatilhos emocionais potentes. Veja o documento!', NOW() - INTERVAL '20 days' + INTERVAL '10 minutes'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'user', 'Cara, você acertou em cheio! Principalmente o ponto sobre "sentir-se desejada" - minhas alunas falam MUITO sobre isso nas conversas. Esse documento vai ser a base de todo meu conteúdo.', NOW() - INTERVAL '2 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

INSERT INTO messages (conversation_id, role, content, created_at)
SELECT id, 'assistant', 'Fico muito feliz que tenha ressoado! Esse insight sobre "sentir-se desejada" é poderoso porque toca numa dor emocional real, não apenas estética. Use isso nos seus posts e stories - mostre transformações que vão além do número na balança. Fale sobre autoestima, relacionamento, energia. Isso vai fazer suas clientes se verem naquela história. 💪', NOW() - INTERVAL '2 days' + INTERVAL '3 minutes'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

-- Bio
INSERT INTO messages (conversation_id, role, content, created_at)
VALUES 
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'user', 'Preciso criar uma bio profissional para meu Instagram. Atualmente está muito genérica.', NOW() - INTERVAL '25 days'),
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'assistant', 'Vamos criar uma bio que converte! Com base no seu nicho (mulheres 30-45, mães ocupadas, emagrecimento), criei uma versão principal com 145 caracteres + 2 variações alternativas. A bio comunica: quem você é (Personal há 8 anos), para quem atende (emagrecimento feminino), seu diferencial (treinos flex para mães ocupadas), localização (SP + Online) e CTA claro. Veja as opções no documento!', NOW() - INTERVAL '25 days' + INTERVAL '5 minutes'),
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'user', 'Gostei da principal! Mas posso aumentar um pouco? Tenho espaço até 150 caracteres.', NOW() - INTERVAL '24 days'),
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'assistant', 'Claro! Vou ajustar para aproveitar melhor os 150 caracteres. Uma sugestão: adicionar número de resultados (+200 mulheres) gera mais credibilidade. Quer que eu teste essa versão?', NOW() - INTERVAL '24 days' + INTERVAL '2 minutes'),
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'user', 'Boa! Mas deixa com os 145 mesmo, ficou mais clean. Vou usar a principal.', NOW() - INTERVAL '24 days' + INTERVAL '10 minutes');

-- Posts
INSERT INTO messages (conversation_id, role, content, created_at)
VALUES
('c2d3e4f5-a6b7-5c8d-9e0f-1a2b3c4d5e6f', 'user', 'Quero criar um carrossel educativo para o feed. Algo sobre os erros mais comuns que impedem emagrecimento.', NOW() - INTERVAL '18 days'),
('c2d3e4f5-a6b7-5c8d-9e0f-1a2b3c4d5e6f', 'assistant', 'Ótima ideia! Post educativo gera muito engajamento. Criei um carrossel de 8 slides sobre "5 Erros que Impedem Seu Emagrecimento" com gancho forte, explicação de cada erro (pular refeições, treinar sem plano, dormir pouco, só fazer cardio, não ter acompanhamento), CTA direto e sugestões visuais. Os erros são exatamente os que suas clientes cometem. Confere!', NOW() - INTERVAL '18 days' + INTERVAL '4 minutes'),
('c2d3e4f5-a6b7-5c8d-9e0f-1a2b3c4d5e6f', 'user', 'Ficou perfeito! Principalmente o erro #5 sobre ter acompanhamento - é sutil mas vende meu trabalho. Vou postar amanhã.', NOW() - INTERVAL '17 days'),
('c2d3e4f5-a6b7-5c8d-9e0f-1a2b3c4d5e6f', 'assistant', 'Exatamente! É educação com venda soft - você agrega valor real e naturalmente posiciona seu serviço como solução. Depois me conta os resultados! E lembre de salvar nos Destaques do Instagram para novos seguidores verem. 📊', NOW() - INTERVAL '17 days' + INTERVAL '2 minutes');

-- Stories
INSERT INTO messages (conversation_id, role, content, created_at)
VALUES
('d3e4f5a6-b7c8-6d9e-0f1a-2b3c4d5e6f7a', 'user', 'Quero criar uma sequência de stories educativos. Pensei em falar sobre hidratação, porque minhas alunas sempre esquecem de beber água.', NOW() - INTERVAL '12 days'),
('d3e4f5a6-b7c8-6d9e-0f1a-2b3c4d5e6f7a', 'assistant', 'Tema perfeito! Hidratação é subestimada e super relevante para emagrecimento. Criei uma série de 6 stories: gancho (caixinha de perguntas), problema (sintomas da desidratação), solução (fórmula: peso x 35ml), hack prático (dicas para beber mais), transformação (benefícios), e CTA final. Cada story tem texto, sugestão visual e interação específica (enquete, quiz, caixinha). Tudo pensado para engajamento máximo!', NOW() - INTERVAL '12 days' + INTERVAL '6 minutes'),
('d3e4f5a6-b7c8-6d9e-0f1a-2b3c4d5e6f7a', 'user', 'Adorei as interações! Vou gravar hoje à tarde. Pode criar outra série sobre outro tema?', NOW() - INTERVAL '10 days'),
('d3e4f5a6-b7c8-6d9e-0f1a-2b3c4d5e6f7a', 'assistant', 'Claro! Vamos fazer um calendário de conteúdo. Sugiro próximas séries: "Mitos sobre emagrecimento", "Como montar prato saudável", "Importância do alongamento", "Treino em casa vs academia". Qual te anima mais? Ou quer outra ideia?', NOW() - INTERVAL '10 days' + INTERVAL '3 minutes');

-- 4. CRIAR VERSÕES DE DOCUMENTOS

-- Nicho - versões antigas
INSERT INTO document_versions (conversation_id, version_number, content, created_at)
SELECT id, 1, '# Definição de Nicho - Rascunho Inicial

Público-alvo: Mulheres que querem emagrecer

Faixa etária: 25-50 anos

Objetivo: Perda de peso

Diferencial: Treinos personalizados', NOW() - INTERVAL '32 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

INSERT INTO document_versions (conversation_id, version_number, content, created_at)
SELECT id, 2, '# Definição de Nicho - Versão 2

**Público-Alvo:**
Mulheres 30-45 anos, profissionais ocupadas, que buscam emagrecimento mas não têm tempo para treinos longos.

**Objetivo:** Emagrecimento saudável e sustentável

**Diferencial:** Treinos curtos e eficientes (30-40 min) que se encaixam na rotina

**Formato:** Online e presencial (São Paulo)', NOW() - INTERVAL '31 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

INSERT INTO document_versions (conversation_id, version_number, content, created_at)
SELECT id, 3, '# Definição de Nicho - Versão 3 (Refinada)

## Público-Alvo Específico
Mulheres 30-45 anos, mães, profissionais ativas, rotina intensa, já tentaram emagrecer antes sem sucesso duradouro.

## Objetivo Principal
Emagrecimento sustentável sem abrir mão da rotina familiar e profissional.

## Método FLEX
Treinos 20-40min adaptáveis à disponibilidade, acompanhamento semanal, alimentação equilibrada.

## Diferencial
Personal que entende a realidade de mães ocupadas.

## Posicionamento
"Treinos que cabem na sua vida, não o contrário"', NOW() - INTERVAL '30 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2';

-- Dores & Desejos - versões
INSERT INTO document_versions (conversation_id, version_number, content, created_at)
SELECT id, 1, '# Dores do Público

1. Falta de tempo para treinar
2. Já tentaram dietas que não funcionam
3. Cansaço e falta de energia
4. Baixa autoestima
5. Não sabem por onde começar', NOW() - INTERVAL '22 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

INSERT INTO document_versions (conversation_id, version_number, content, created_at)
SELECT id, 2, '# Dores, Objeções e Desejos - Versão Expandida

## Dores Principais
1. Efeito sanfona - emagrecem e engordam de novo
2. Rotina exaustiva sem tempo para si mesma
3. Não se reconhece mais no espelho
4. Dietas radicais geram compulsão
5. Falta de apoio familiar

## Objeções
- Não tenho tempo
- É muito caro
- Já tentei e não funciona

## Desejos
- Voltar a usar roupas antigas
- Ter energia para brincar com filhos
- Sentir-se bonita e desejada
- Ser exemplo para os filhos', NOW() - INTERVAL '21 days'
FROM conversations WHERE user_id = '68b69c96-d6b5-4e0f-a70e-25b140203bcc' AND agent_id = 'd6b12918-e241-4ce4-a58f-6f6278444322';

-- Bio - versões
INSERT INTO document_versions (conversation_id, version_number, content, created_at)
VALUES
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 1, '# Bio Instagram - Primeira Versão

Personal Trainer | Especialista em emagrecimento
Treinos online e presencial
São Paulo
Link: [avaliação gratuita]', NOW() - INTERVAL '26 days'),
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 2, '# Bio Instagram - Versão 2

🏋️ Personal há 8 anos
💪 Emagrecimento feminino 30-45 anos
📍 SP • Online
👇 Agende sua avaliação gratuita

Alternativa: Personal especializado em emagrecimento para mulheres ocupadas. Treinos flex que cabem na sua rotina.', NOW() - INTERVAL '25 days');

-- Posts - versões
INSERT INTO document_versions (conversation_id, version_number, content, created_at)
VALUES
('c2d3e4f5-a6b7-5c8d-9e0f-1a2b3c4d5e6f', 1, '# Post - Rascunho

Tema: Erros comuns no emagrecimento

Erros:
1. Pular refeições
2. Não beber água
3. Só fazer cardio
4. Dormir pouco
5. Treinar sem orientação', NOW() - INTERVAL '19 days'),
('c2d3e4f5-a6b7-5c8d-9e0f-1a2b3c4d5e6f', 2, '# Post Carrossel - Versão 2

**Gancho:** "Por que você não emagrece? 5 erros que você pode estar cometendo 👇"

**Slides:**
1. Pular refeições desacelera metabolismo
2. Treinar sem plano = sem resultado
3. Dormir menos de 7h aumenta cortisol
4. Cardio sozinho não basta
5. Personal acelera seus resultados

**CTA:** Quer ajuda? Manda DM', NOW() - INTERVAL '18 days');

-- Stories - versões
INSERT INTO document_versions (conversation_id, version_number, content, created_at)
VALUES
('d3e4f5a6-b7c8-6d9e-0f1a-2b3c4d5e6f7a', 1, '# Stories sobre Hidratação - Esboço

Story 1: Você bebe água suficiente?
Story 2: Desidratação prejudica emagrecimento
Story 3: Fórmula: peso x 35ml
Story 4: Dicas para beber mais água
Story 5: CTA: Me chama no direct', NOW() - INTERVAL '13 days');

-- 5. CRIAR/ATUALIZAR PROGRESSO DOS AGENTES
INSERT INTO user_agent_progress (user_id, agent_id, progress, last_accessed_at, created_at, updated_at)
VALUES
  ('68b69c96-d6b5-4e0f-a70e-25b140203bcc', 'ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2', 100, NOW() - INTERVAL '3 days', NOW() - INTERVAL '32 days', NOW() - INTERVAL '3 days'),
  ('68b69c96-d6b5-4e0f-a70e-25b140203bcc', 'd6b12918-e241-4ce4-a58f-6f6278444322', 85, NOW() - INTERVAL '1 day', NOW() - INTERVAL '22 days', NOW() - INTERVAL '1 day'),
  ('68b69c96-d6b5-4e0f-a70e-25b140203bcc', '45965454-0db5-4e6a-a0c1-c168a7ea90f5', 100, NOW() - INTERVAL '2 days', NOW() - INTERVAL '26 days', NOW() - INTERVAL '2 days'),
  ('68b69c96-d6b5-4e0f-a70e-25b140203bcc', '18b81b41-0ff6-411f-b5b5-11c34f5b5190', 60, NOW() - INTERVAL '5 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '5 days'),
  ('68b69c96-d6b5-4e0f-a70e-25b140203bcc', 'ac749289-54a6-47bf-89e4-7733902112d5', 40, NOW() - INTERVAL '1 day', NOW() - INTERVAL '13 days', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, agent_id) 
DO UPDATE SET 
  progress = EXCLUDED.progress,
  last_accessed_at = EXCLUDED.last_accessed_at,
  updated_at = EXCLUDED.updated_at;