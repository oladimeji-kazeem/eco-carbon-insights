import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface SettingsForm {
  site_name: string;
  tagline: string;
  description: string;
  logo_url: string;
  og_image_url: string;
  seo_title: string;
  seo_description: string;
  social_links: { twitter?: string; facebook?: string; instagram?: string; linkedin?: string };
}

export default function SiteSettingsEditor() {
  const { data, isLoading } = useSiteSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<SettingsForm>({
    site_name: "", tagline: "", description: "", logo_url: "",
    og_image_url: "", seo_title: "", seo_description: "", social_links: {},
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        site_name: data.site_name ?? "",
        tagline: data.tagline ?? "",
        description: data.description ?? "",
        logo_url: data.logo_url ?? "",
        og_image_url: data.og_image_url ?? "",
        seo_title: data.seo_title ?? "",
        seo_description: data.seo_description ?? "",
        social_links: (data.social_links as SettingsForm["social_links"]) ?? {},
      });
    }
  }, [data]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(form).eq("id", data.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    }
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground">Branding, SEO defaults and social links.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Site name</Label><Input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} /></div>
          <div><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Logo URL</Label><Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>SEO title (default)</Label><Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} /></div>
          <div><Label>SEO description</Label><Textarea rows={2} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} /></div>
          <div><Label>OG image URL</Label><Input value={form.og_image_url} onChange={(e) => setForm({ ...form, og_image_url: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social links</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {(["twitter", "facebook", "instagram", "linkedin"] as const).map((k) => (
            <div key={k}>
              <Label className="capitalize">{k}</Label>
              <Input
                value={form.social_links[k] ?? ""}
                onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, [k]: e.target.value } })}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
