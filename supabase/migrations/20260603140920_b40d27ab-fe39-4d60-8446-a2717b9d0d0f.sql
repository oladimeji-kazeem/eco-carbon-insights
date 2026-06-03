
-- Content status enum
DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM (
    'draft','in_review','changes_requested','approved','scheduled','published','archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.content_type AS ENUM ('site_content','programme','page');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- content_items
CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.content_type NOT NULL,
  slug text NOT NULL,
  title text NOT NULL DEFAULT '',
  published_version_id uuid,
  current_version_id uuid,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (type, slug)
);

GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads content items" ON public.content_items
  FOR SELECT USING (true);

CREATE POLICY "Staff manage content items" ON public.content_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor') OR public.has_role(auth.uid(),'reviewer') OR public.has_role(auth.uid(),'contributor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor') OR public.has_role(auth.uid(),'contributor'));

-- content_versions
CREATE TABLE IF NOT EXISTS public.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  version_number int NOT NULL DEFAULT 1,
  status public.content_status NOT NULL DEFAULT 'draft',
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  note text,
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_versions_item ON public.content_versions(item_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_status ON public.content_versions(status);

GRANT SELECT ON public.content_versions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_versions TO authenticated;
GRANT ALL ON public.content_versions TO service_role;

ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads published versions" ON public.content_versions
  FOR SELECT USING (status = 'published');

CREATE POLICY "Staff read all versions" ON public.content_versions
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
    OR public.has_role(auth.uid(),'reviewer') OR public.has_role(auth.uid(),'viewer')
    OR author_id = auth.uid()
  );

CREATE POLICY "Authors create versions" ON public.content_versions
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND (
      public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
      OR public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'reviewer')
    )
  );

CREATE POLICY "Authors update own; staff update any" ON public.content_versions
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
    OR public.has_role(auth.uid(),'reviewer')
    OR (author_id = auth.uid() AND status IN ('draft','changes_requested'))
  )
  WITH CHECK (
    public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
    OR public.has_role(auth.uid(),'reviewer')
    OR (author_id = auth.uid() AND status IN ('draft','in_review','changes_requested'))
  );

CREATE POLICY "Editors delete versions" ON public.content_versions
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

ALTER TABLE public.content_items
  ADD CONSTRAINT content_items_published_version_fk
    FOREIGN KEY (published_version_id) REFERENCES public.content_versions(id) ON DELETE SET NULL,
  ADD CONSTRAINT content_items_current_version_fk
    FOREIGN KEY (current_version_id) REFERENCES public.content_versions(id) ON DELETE SET NULL;

-- Reviews
CREATE TABLE IF NOT EXISTS public.content_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid NOT NULL REFERENCES public.content_versions(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  decision text NOT NULL CHECK (decision IN ('approve','request_changes','comment')),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.content_reviews TO authenticated;
GRANT ALL ON public.content_reviews TO service_role;

ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read reviews" ON public.content_reviews
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
    OR public.has_role(auth.uid(),'reviewer') OR public.has_role(auth.uid(),'viewer')
    OR public.has_role(auth.uid(),'contributor')
  );

CREATE POLICY "Reviewers insert reviews" ON public.content_reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() AND (
      public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
      OR public.has_role(auth.uid(),'reviewer')
    )
  );

-- Audit log
CREATE TABLE IF NOT EXISTS public.content_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES public.content_items(id) ON DELETE SET NULL,
  version_id uuid REFERENCES public.content_versions(id) ON DELETE SET NULL,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.content_audit_log TO authenticated;
GRANT ALL ON public.content_audit_log TO service_role;

ALTER TABLE public.content_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read audit" ON public.content_audit_log
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
    OR public.has_role(auth.uid(),'reviewer') OR public.has_role(auth.uid(),'viewer')
  );

CREATE POLICY "Auth users insert audit" ON public.content_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Staff insert notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
    OR public.has_role(auth.uid(),'reviewer') OR public.has_role(auth.uid(),'contributor')
  );
CREATE POLICY "Users delete own notifications" ON public.notifications
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER trg_content_items_updated BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_content_versions_updated BEFORE UPDATE ON public.content_versions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Publish helper
CREATE OR REPLACE FUNCTION public.publish_content_version(_version_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item uuid;
BEGIN
  IF NOT (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')) THEN
    RAISE EXCEPTION 'Insufficient permissions to publish';
  END IF;
  SELECT item_id INTO v_item FROM public.content_versions WHERE id = _version_id;
  IF v_item IS NULL THEN RAISE EXCEPTION 'Version not found'; END IF;

  UPDATE public.content_versions
    SET status = 'archived'
    WHERE item_id = v_item AND status = 'published' AND id <> _version_id;

  UPDATE public.content_versions
    SET status = 'published', published_at = now()
    WHERE id = _version_id;

  UPDATE public.content_items
    SET published_version_id = _version_id, current_version_id = _version_id, updated_at = now()
    WHERE id = v_item;

  INSERT INTO public.content_audit_log (item_id, version_id, actor_id, action)
    VALUES (v_item, _version_id, auth.uid(), 'publish');
END $$;

REVOKE ALL ON FUNCTION public.publish_content_version(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_content_version(uuid) TO authenticated;

-- Backfill from existing site_content + programmes
DO $$
DECLARE
  r record;
  v_item uuid;
  v_ver uuid;
BEGIN
  FOR r IN SELECT * FROM public.site_content LOOP
    INSERT INTO public.content_items (type, slug, title)
      VALUES ('site_content', r.section || '.' || r.key, r.section || '.' || r.key)
      ON CONFLICT (type, slug) DO UPDATE SET updated_at = now()
      RETURNING id INTO v_item;
    INSERT INTO public.content_versions (item_id, version_number, status, value, published_at)
      VALUES (v_item, 1, 'published', jsonb_build_object('value', r.value), now())
      RETURNING id INTO v_ver;
    UPDATE public.content_items
      SET published_version_id = v_ver, current_version_id = v_ver
      WHERE id = v_item;
  END LOOP;

  FOR r IN SELECT * FROM public.programmes LOOP
    INSERT INTO public.content_items (type, slug, title)
      VALUES ('programme', r.slug, r.title)
      ON CONFLICT (type, slug) DO UPDATE SET title = EXCLUDED.title, updated_at = now()
      RETURNING id INTO v_item;
    INSERT INTO public.content_versions (item_id, version_number, status, value, published_at)
      VALUES (v_item, 1,
        CASE WHEN r.published THEN 'published'::public.content_status ELSE 'draft'::public.content_status END,
        to_jsonb(r) - 'id' - 'created_at' - 'updated_at',
        CASE WHEN r.published THEN now() ELSE NULL END)
      RETURNING id INTO v_ver;
    UPDATE public.content_items
      SET current_version_id = v_ver,
          published_version_id = CASE WHEN r.published THEN v_ver ELSE NULL END
      WHERE id = v_item;
  END LOOP;
END $$;
