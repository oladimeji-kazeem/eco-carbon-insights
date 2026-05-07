-- 1. Roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile + first-user-as-admin on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  SELECT count(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'viewer');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Site settings (singleton)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Eco Centre',
  tagline TEXT DEFAULT 'Inform · Inspire · Enable',
  description TEXT DEFAULT 'Empowering people, communities and organisations to take action on climate change and live more sustainably',
  logo_url TEXT,
  og_image_url TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_settings (site_name, tagline, description) VALUES
  ('Eco Centre', 'Inform · Inspire · Enable', 'Empowering people, communities and organisations to take action on climate change and live more sustainably');

-- 4. Site content (key/value blocks)
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (section, key)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads site content" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site content" ON public.site_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER site_content_touch BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed homepage content
INSERT INTO public.site_content (section, key, value) VALUES
  ('hero', 'eyebrow', '"Inform · Inspire · Enable"'),
  ('hero', 'title', '"Empowering people to live and work more sustainably"'),
  ('hero', 'subtitle', '"Eco Centre supports households, communities and organisations across the South West to take meaningful action on climate change."'),
  ('hero', 'primary_cta', '{"label":"Support Our Work","href":"#cta"}'),
  ('hero', 'secondary_cta', '{"label":"Explore Programmes","href":"#programmes"}'),
  ('cta', 'title', '"Help us help our planet"'),
  ('cta', 'subtitle', '"Partner with Eco Centre to inform, inspire and enable climate action in your community."'),
  ('cta', 'button', '{"label":"Get Involved","href":"https://www.ecocentresw.org/"}'),
  ('features', 'heading', '"Our Programmes"'),
  ('features', 'subtitle', '"Practical action through community outreach, education, infrastructure, and cross-sector collaboration."');

-- 5. Programmes
CREATE TABLE public.programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Leaf',
  mission TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  pillars JSONB NOT NULL DEFAULT '[]'::jsonb,
  focus_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_label TEXT,
  cta_href TEXT,
  external_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads published programmes" ON public.programmes
  FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Editors manage programmes" ON public.programmes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER programmes_touch BEFORE UPDATE ON public.programmes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.programmes (slug, title, tagline, icon, mission, description, highlights, pillars, focus_areas, cta_label, cta_href, external_url, sort_order) VALUES
  ('sustainability-centre', 'Sustainability Centre', 'A new sustainability hub for the South West', 'Building2',
   'Create a brand new sustainability hub and visitor attraction in the South West.',
   'A flagship visitor centre that brings sustainable living to life through interactive exhibits and demonstrations.',
   '["Interactive exhibits","Live demonstrations","Expert advice clinics","Conference space"]'::jsonb,
   '["Inform","Inspire"]'::jsonb, '["Energy","Operations"]'::jsonb,
   'Support the Centre', 'https://www.crowdfunder.co.uk/p/eco-save', 'https://www.ecocentresw.org/eco-centre/', 1),
  ('climate-action-plans', 'Climate Action Plans', 'Cut emissions, save money — together', 'MapPin',
   'Help people and communities reduce carbon emissions and save money.',
   'A new approach to community climate action with locally-tailored plans.',
   '["Locally-tailored plans","Highest-impact actions","Connects communities with funding","Tracks progress"]'::jsonb,
   '["Inform","Enable"]'::jsonb, '["Energy","Travel"]'::jsonb,
   'Join a Climate Action Plan', 'https://www.ecocentresw.org/community-action/climate-action-plans/', 'https://www.ecocentresw.org/community-action/climate-action-plans/', 2),
  ('climate-action-programme', 'South West Climate Action Programme', 'Cultivating sustainable innovation', 'Lightbulb',
   'Encourage and cultivate sustainable innovation across sectors.',
   'A cross-sector programme that connects sustainability champions across business, public sector and community.',
   '["Cross-sector challenges","Champion network","Green tech showcases","Co-creation workshops"]'::jsonb,
   '["Inspire","Enable"]'::jsonb, '["Operations","Logistics"]'::jsonb,
   'Become a Champion', 'https://www.ecocentresw.org/south-west-climate-action-programme/', 'https://www.ecocentresw.org/south-west-climate-action-programme/', 3),
  ('eco-centres', 'Eco Centres', 'Centres of excellence for sustainable living', 'Leaf',
   'Establish centres of excellence for sustainable living and working.',
   'A network of regional Eco Centres providing hands-on advice, training and demonstrations.',
   '["Practical training","Real-world demos","Open to public and businesses","Local best practice hubs"]'::jsonb,
   '["Inform","Enable"]'::jsonb, '["Energy","Operations"]'::jsonb,
   'Explore the network', 'https://www.ecocentresw.org/eco-centre/', 'https://www.ecocentresw.org/eco-centre/', 4),
  ('community-climate-action', 'Community Climate Action', 'Locally inspired action for the planet', 'Users',
   'Community-based programme working with local people on sustainability.',
   'We support neighbourhood groups, schools and local organisations to lead their own climate action.',
   '["Project incubation","Community events","Schools programmes","Funding signposting"]'::jsonb,
   '["Inspire","Enable"]'::jsonb, '["Travel","Operations"]'::jsonb,
   'Get your community involved', 'https://www.ecocentresw.org/community-action-plan/', 'https://www.ecocentresw.org/community-action-plan/', 5),
  ('eco-save-app', 'Eco-Save App', 'Cut carbon, waste, water — and bills', 'Smartphone',
   'Help people cut household carbon emissions, waste and water usage.',
   'Eco-Save makes sustainable living easy with personalised tips and tracking.',
   '["Personalised tips","Carbon tracking","Bite-sized challenges","Save on bills"]'::jsonb,
   '["Inform","Inspire"]'::jsonb, '["Energy","Travel"]'::jsonb,
   'Back the Eco-Save App', 'https://www.crowdfunder.co.uk/p/eco-save', 'https://www.ecocentresw.org/eco-save-app/', 6);