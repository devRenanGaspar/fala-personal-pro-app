-- Permitir admins lerem todas as conversas (para visualizar documentos)
CREATE POLICY "Admins can view all conversations"
ON conversations
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Permitir admins lerem todos os profiles (para estatísticas)
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Permitir admins lerem todas as mensagens (para estatísticas)
CREATE POLICY "Admins can view all messages"
ON messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'));