-- Create portfolio_info table
CREATE TABLE IF NOT EXISTS public.portfolio_info (
    id integer PRIMARY KEY DEFAULT 1,
    hero_title text NOT NULL,
    hero_subtitle text NOT NULL,
    about_text text NOT NULL,
    contact_email text NOT NULL,
    contact_phone text NOT NULL,
    contact_address text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Set up RLS
ALTER TABLE public.portfolio_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for portfolio_info"
    ON public.portfolio_info FOR SELECT
    USING (true);

-- Insert seed data
INSERT INTO public.portfolio_info (id, hero_title, hero_subtitle, about_text, contact_email, contact_phone, contact_address)
VALUES (
    1,
    'FORM FOLLOWS NOTHING',
    'WE CREATE RADICAL, UNCOMPROMISING STRUCTURES THAT CHALLENGE THE STATUS QUO. BRUTALIST ESTHETICS FOR A MODERN ERA.',
    'Founded in 2026, Arch // Studio is a collective of visionary architects dedicated to raw, honest materials. We believe in the power of concrete, steel, and glass to shape the human experience. Our work strips away the unnecessary, leaving only the essential structural truth.',
    'INFO@ARCHSTUDIO.COM',
    '+1 800 BRUTAL',
    '1984 CONCRETE AVENUE, SECTOR 7G, NEOTOKYO, EARTH'
) ON CONFLICT (id) DO NOTHING;

-- Set up Storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio_images', 'portfolio_images', true) ON CONFLICT DO NOTHING;

-- Set up Storage RLS
CREATE POLICY "Public Image Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio_images');
