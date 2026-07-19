-- Add initial message and suggested replies columns to agents table
ALTER TABLE agents
ADD COLUMN initial_message text,
ADD COLUMN suggested_replies text;

-- Add comments for documentation
COMMENT ON COLUMN agents.initial_message IS 'Welcome message displayed when user starts a new conversation';
COMMENT ON COLUMN agents.suggested_replies IS 'Pipe-separated suggested first messages for user (e.g. "Option 1|Option 2|Option 3")';