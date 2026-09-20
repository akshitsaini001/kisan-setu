-- Add verified procurement measurements and applied rate.
ALTER TABLE public.tokens
ADD COLUMN IF NOT EXISTS actual_quantity NUMERIC(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rate NUMERIC(10, 2) DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_tokens_farmer ON public.tokens(farmer);

ALTER TABLE public.tokens
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12, 2) DEFAULT NULL;
