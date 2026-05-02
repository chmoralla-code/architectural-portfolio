-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    image_url text,
    year integer NOT NULL,
    client text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.projects FOR SELECT
    USING (true);

-- Create a policy for authenticated users to insert/update/delete (optional for later)
CREATE POLICY "Authenticated users can insert projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (true);

-- Insert seed data
INSERT INTO public.projects (title, description, image_url, year, client)
VALUES 
    ('CONCRETE MONOLITH', 'A brutalist residential complex.', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop', 2025, 'PRIVATE'),
    ('VOID GALLERY', 'Exhibition space carved from stone.', 'https://images.unsplash.com/photo-1600607688066-890987f18a86?q=80&w=1000&auto=format&fit=crop', 2024, 'CITY ARTS'),
    ('STEEL & GLASS PAVILION', 'Industrial pavilion.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop', 2023, 'TECH CORP'),
    ('RAW FORM HQ', 'Corporate headquarters.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop', 2022, 'RAW INC')
ON CONFLICT DO NOTHING;
