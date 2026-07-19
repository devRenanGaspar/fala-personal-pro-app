-- Inserir mensagens fake para as 10 conversas criadas
-- Simulando diálogos realistas entre usuário e assistente

-- 1. Nicho - Mulheres 30-45 anos (4 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('a25a2afc-b34c-4eed-b517-84106928a460', 'user', 'Quero focar em mulheres que querem emagrecer', NOW() - INTERVAL '2 hours'),
('a25a2afc-b34c-4eed-b517-84106928a460', 'assistant', 'Ótimo! Me conta: qual faixa etária? Elas trabalham fora?', NOW() - INTERVAL '1 hour 50 minutes'),
('a25a2afc-b34c-4eed-b517-84106928a460', 'user', '30-45 anos, mães, trabalham e não têm tempo', NOW() - INTERVAL '1 hour 40 minutes'),
('a25a2afc-b34c-4eed-b517-84106928a460', 'assistant', 'Perfeito! Criei a definição de nicho focada nesse público. Veja o documento na direita 👉', NOW() - INTERVAL '1 hour 30 minutes');

-- 2. Nicho - Idosos Ativos 60+ (4 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('b2ab7843-ee5a-4606-ad9f-fe0b669b723b', 'user', 'Pensei em atender público mais velho, acima de 60', NOW() - INTERVAL '3 hours'),
('b2ab7843-ee5a-4606-ad9f-fe0b669b723b', 'assistant', 'Excelente nicho! O que eles buscam principalmente?', NOW() - INTERVAL '2 hours 50 minutes'),
('b2ab7843-ee5a-4606-ad9f-fe0b669b723b', 'user', 'Mobilidade, independência, qualidade de vida', NOW() - INTERVAL '2 hours 40 minutes'),
('b2ab7843-ee5a-4606-ad9f-fe0b669b723b', 'assistant', 'Criei o documento focado em idosos ativos que buscam autonomia. Documento pronto! 📄', NOW() - INTERVAL '2 hours 30 minutes');

-- 3. Dores - Falta de Tempo (4 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('ef96f11e-e6a8-4802-b7df-d301e01f06ab', 'user', 'Minhas clientes reclamam muito de falta de tempo', NOW() - INTERVAL '4 hours'),
('ef96f11e-e6a8-4802-b7df-d301e01f06ab', 'assistant', 'Vamos mapear essa dor. Elas trabalham quantas horas por dia?', NOW() - INTERVAL '3 hours 50 minutes'),
('ef96f11e-e6a8-4802-b7df-d301e01f06ab', 'user', 'A maioria trabalha 8-10h e ainda cuida de filhos', NOW() - INTERVAL '3 hours 40 minutes'),
('ef96f11e-e6a8-4802-b7df-d301e01f06ab', 'assistant', 'Entendi o cenário! Mapeei as dores relacionadas à rotina intensa. Confira o documento 📋', NOW() - INTERVAL '3 hours 30 minutes');

-- 4. Desejos - Transformação (4 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('5d79db9a-8449-4761-8977-914aa6acccc4', 'user', 'Quero entender melhor os desejos do meu público', NOW() - INTERVAL '5 hours'),
('5d79db9a-8449-4761-8977-914aa6acccc4', 'assistant', 'Vamos lá! O que elas sonham alcançar com o treino?', NOW() - INTERVAL '4 hours 50 minutes'),
('5d79db9a-8449-4761-8977-914aa6acccc4', 'user', 'Autoestima, usar roupas que gostam, ter mais energia', NOW() - INTERVAL '4 hours 40 minutes'),
('5d79db9a-8449-4761-8977-914aa6acccc4', 'assistant', 'Mapeei os desejos e gatilhos emocionais do seu público! Documento está completo 💭', NOW() - INTERVAL '4 hours 30 minutes');

-- 5. Bio - Versão Impacto (4 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('f12bb8a8-c230-406f-a79b-7dc621862aeb', 'user', 'Preciso de uma bio mais impactante', NOW() - INTERVAL '6 hours'),
('f12bb8a8-c230-406f-a79b-7dc621862aeb', 'assistant', 'Qual resultado você mais entrega aos seus clientes?', NOW() - INTERVAL '5 hours 50 minutes'),
('f12bb8a8-c230-406f-a79b-7dc621862aeb', 'user', 'Transformação em 90 dias para quem não tem tempo', NOW() - INTERVAL '5 hours 40 minutes'),
('f12bb8a8-c230-406f-a79b-7dc621862aeb', 'assistant', 'Criei uma bio focada em impacto e resultado! Veja as 3 variações no documento 📱', NOW() - INTERVAL '5 hours 30 minutes');

-- 6. Bio - Versão Técnica (4 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('92165972-e479-4b9f-bae9-afe93b9b1d60', 'user', 'Quero uma bio que destaque minha formação', NOW() - INTERVAL '7 hours'),
('92165972-e479-4b9f-bae9-afe93b9b1d60', 'assistant', 'Quais suas principais certificações e formações?', NOW() - INTERVAL '6 hours 50 minutes'),
('92165972-e479-4b9f-bae9-afe93b9b1d60', 'user', 'CREF, especialização em biomecânica e nutrição esportiva', NOW() - INTERVAL '6 hours 40 minutes'),
('92165972-e479-4b9f-bae9-afe93b9b1d60', 'assistant', 'Criei uma versão técnica destacando suas credenciais! Bio profissional pronta 🎓', NOW() - INTERVAL '6 hours 30 minutes');

-- 7. Post - Carrossel Treino Casa (5 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('5f0bbd1c-28cd-4911-a708-427242566bd7', 'user', 'Quero um carrossel sobre treinar em casa', NOW() - INTERVAL '8 hours'),
('5f0bbd1c-28cd-4911-a708-427242566bd7', 'assistant', 'Boa ideia! Quantos exercícios? Vai usar equipamentos?', NOW() - INTERVAL '7 hours 50 minutes'),
('5f0bbd1c-28cd-4911-a708-427242566bd7', 'user', '7 exercícios, sem equipamento nenhum', NOW() - INTERVAL '7 hours 40 minutes'),
('5f0bbd1c-28cd-4911-a708-427242566bd7', 'assistant', 'Perfeito para seu público! Vou criar algo bem didático', NOW() - INTERVAL '7 hours 35 minutes'),
('5f0bbd1c-28cd-4911-a708-427242566bd7', 'assistant', 'Montei o carrossel completo com 7 slides! Cada exercício tem descrição e dica de execução 📸', NOW() - INTERVAL '7 hours 30 minutes');

-- 8. Post - Motivacional Segunda (3 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('822126ad-e298-49b2-9d76-374773b3a915', 'user', 'Preciso de um post motivacional pra segunda-feira', NOW() - INTERVAL '9 hours'),
('822126ad-e298-49b2-9d76-374773b3a915', 'assistant', 'Qual tom? Mais enérgico ou acolhedor?', NOW() - INTERVAL '8 hours 50 minutes'),
('822126ad-e298-49b2-9d76-374773b3a915', 'user', 'Enérgico mas sem ser agressivo', NOW() - INTERVAL '8 hours 40 minutes'),
('822126ad-e298-49b2-9d76-374773b3a915', 'assistant', 'Criei o post motivacional para começar a semana com energia! Post pronto 💪', NOW() - INTERVAL '8 hours 30 minutes');

-- 9. Stories - Série Hidratação (5 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('749b81d3-2e26-4c2d-a513-7b6fc0ce28e0', 'user', 'Quero fazer stories sobre beber água', NOW() - INTERVAL '10 hours'),
('749b81d3-2e26-4c2d-a513-7b6fc0ce28e0', 'assistant', 'Educativo ou mais leve? Quantos stories você quer?', NOW() - INTERVAL '9 hours 50 minutes'),
('749b81d3-2e26-4c2d-a513-7b6fc0ce28e0', 'user', 'Educativo com dados científicos, uns 5 stories', NOW() - INTERVAL '9 hours 40 minutes'),
('749b81d3-2e26-4c2d-a513-7b6fc0ce28e0', 'assistant', 'Ótimo! Vou incluir enquetes e caixinha de perguntas também', NOW() - INTERVAL '9 hours 35 minutes'),
('749b81d3-2e26-4c2d-a513-7b6fc0ce28e0', 'assistant', 'Criei a série completa sobre hidratação! 5 stories com dados + interação 📹', NOW() - INTERVAL '9 hours 30 minutes');

-- 10. Stories - Bastidores Treino (4 mensagens)
INSERT INTO messages (conversation_id, role, content, created_at) VALUES
('23f4f110-0d97-48ad-abc0-5ae52c4243ff', 'user', 'Quero mostrar meus bastidores de treino', NOW() - INTERVAL '11 hours'),
('23f4f110-0d97-48ad-abc0-5ae52c4243ff', 'assistant', 'Seu treino pessoal ou de alunos? Qual objetivo?', NOW() - INTERVAL '10 hours 50 minutes'),
('23f4f110-0d97-48ad-abc0-5ae52c4243ff', 'user', 'Meu treino pessoal, pra humanizar e me conectar com o público', NOW() - INTERVAL '10 hours 40 minutes'),
('23f4f110-0d97-48ad-abc0-5ae52c4243ff', 'assistant', 'Montei 4 stories mostrando sua rotina de treino! Perfeito para humanizar 🎬', NOW() - INTERVAL '10 hours 30 minutes');