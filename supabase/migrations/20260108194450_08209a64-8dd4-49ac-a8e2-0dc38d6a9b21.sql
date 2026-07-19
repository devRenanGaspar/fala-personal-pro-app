-- Policy para admins atualizarem agentes
CREATE POLICY "Admins can update agents" ON agents
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Policy para admins inserirem agentes
CREATE POLICY "Admins can insert agents" ON agents
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- Policy para admins deletarem agentes
CREATE POLICY "Admins can delete agents" ON agents
  FOR DELETE USING (has_role(auth.uid(), 'admin'));