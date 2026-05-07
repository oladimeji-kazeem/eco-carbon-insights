import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteContent, contentMap } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface Block {
  section: string;
  key: string;
  label: string;
  type: "text" | "textarea" | "cta";
}

const BLOCKS: Block[] = [
  { section: "hero", key: "eyebrow", label: "Hero — Eyebrow", type: "text" },
  { section: "hero", key: "title", label: "Hero — Title", type: "textarea" },
  { section: "hero", key: "subtitle", label: "Hero — Subtitle", type: "textarea" },
  { section: "hero", key: "primary_cta", label: "Hero — Primary CTA", type: "cta" },
  { section: "hero", key: "secondary_cta", label: "Hero — Secondary CTA", type: "cta" },
  { section: "features", key: "heading", label: "Programmes — Heading", type: "text" },
  { section: "features", key: "subtitle", label: "Programmes — Subtitle", type: "textarea" },
  { section: "cta", key: "title", label: "CTA — Title", type: "text" },
  { section: "cta", key: "subtitle", label: "CTA — Subtitle", type: "textarea" },
  { section: "cta", key: "button", label: "CTA — Button", type: "cta" },
];

export default function ContentEditor() {
  const { data, isLoading } = useSiteContent();
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setValues(contentMap(data));
  }, [data]);

  const setVal = (key: string, v: unknown) => setValues((p) => ({ ...p, [key]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const rows = BLOCKS.map((b) => ({
        section: b.section,
        key: b.key,
        value: (values[b.key] ?? (b.type === "cta" ? { label: "", href: "" } : "")) as never,
      }));
      const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "section,key" });
      if (error) throw error;
      toast.success("Content saved");
      qc.invalidateQueries({ queryKey: ["site_content"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Homepage Content</h1>
          <p className="text-muted-foreground">Edit the copy that appears on your homepage.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </Button>
      </div>

      <div className="space-y-4">
        {BLOCKS.map((b) => (
          <Card key={`${b.section}-${b.key}`}>
            <CardHeader>
              <CardTitle className="text-base">{b.label}</CardTitle>
              <CardDescription className="text-xs">section: {b.section} · key: {b.key}</CardDescription>
            </CardHeader>
            <CardContent>
              {b.type === "text" && (
                <Input
                  value={(values[b.key] as string) ?? ""}
                  onChange={(e) => setVal(b.key, e.target.value)}
                />
              )}
              {b.type === "textarea" && (
                <Textarea
                  rows={3}
                  value={(values[b.key] as string) ?? ""}
                  onChange={(e) => setVal(b.key, e.target.value)}
                />
              )}
              {b.type === "cta" && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={(values[b.key] as { label?: string })?.label ?? ""}
                      onChange={(e) =>
                        setVal(b.key, { ...(values[b.key] as object), label: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">URL or anchor</Label>
                    <Input
                      value={(values[b.key] as { href?: string })?.href ?? ""}
                      onChange={(e) =>
                        setVal(b.key, { ...(values[b.key] as object), href: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
