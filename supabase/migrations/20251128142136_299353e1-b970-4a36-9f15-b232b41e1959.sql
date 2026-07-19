-- Drop existing RESTRICTIVE policies
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;

DROP POLICY IF EXISTS "Users can view messages from own conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages to own conversations" ON messages;

DROP POLICY IF EXISTS "Users can view versions from own conversations" ON document_versions;
DROP POLICY IF EXISTS "Users can insert versions to own conversations" ON document_versions;

-- Recreate as PERMISSIVE policies (default)
-- Conversations policies
CREATE POLICY "Users can view own conversations" 
ON conversations
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" 
ON conversations
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" 
ON conversations
FOR UPDATE 
USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages from own conversations" 
ON messages
FOR SELECT 
USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages to own conversations" 
ON messages
FOR INSERT 
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  )
);

-- Document versions policies
CREATE POLICY "Users can view versions from own conversations" 
ON document_versions
FOR SELECT 
USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert versions to own conversations" 
ON document_versions
FOR INSERT 
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  )
);