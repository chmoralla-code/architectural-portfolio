-- Add Telegram configuration fields to portfolio_info table
ALTER TABLE public.portfolio_info
ADD COLUMN IF NOT EXISTS telegram_bot_token text DEFAULT '',
ADD COLUMN IF NOT EXISTS telegram_chat_id text DEFAULT '';
