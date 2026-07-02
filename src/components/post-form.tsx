import { useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type Post, type PostCategory, type PostLink } from "@/lib/posts";
import { toast } from "sonner";

export type PostFormValue = {
  title: string;
  category: PostCategory;
  content: string;
  image_url: string;
  links: PostLink[];
};

export function PostForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<Post>;
  submitLabel: string;
  onSubmit: (v: PostFormValue) => Promise<unknown>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<PostCategory>(
    (initial?.category as PostCategory) ?? "announcement",
  );
  const [content, setContent] = useState(initial?.content ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [links, setLinks] = useState<PostLink[]>(
    (initial?.links as PostLink[] | undefined) ?? [],
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file, {
      cacheControl: "3600", upsert: false,
    });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        title, category, content,
        image_url: imageUrl,
        links: links.filter((l) => l.label && l.url),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass-strong space-y-5 rounded-2xl p-6">
      <Field label="Title">
        <input
          required value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none ring-primary/40 transition focus:border-primary/50 focus:ring-2"
          placeholder="What's the news?"
        />
      </Field>

      <Field label="Category">
        <select
          value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none ring-primary/40 transition focus:border-primary/50 focus:ring-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} className="bg-background">{c.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Content">
        <textarea
          rows={6} value={content} onChange={(e) => setContent(e.target.value)}
          className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none ring-primary/40 transition focus:border-primary/50 focus:ring-2"
          placeholder="Write your post… line breaks preserved."
        />
      </Field>

      <Field label="Image">
        <div className="space-y-2">
          <input
            value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none ring-primary/40 transition focus:border-primary/50 focus:ring-2"
            placeholder="https://… or upload below"
          />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-foreground/80 transition hover:bg-white/10">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload image
            <input
              type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
            />
          </label>
          {imageUrl && (
            <img src={imageUrl} alt="preview" className="mt-2 max-h-48 rounded-lg border border-white/10 object-cover" />
          )}
        </div>
      </Field>

      <Field label="Links / CTAs">
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={l.label}
                onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                placeholder="Label"
                className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
              <input
                value={l.url}
                onChange={(e) => setLinks(links.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                placeholder="https://…"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
              <button
                type="button"
                onClick={() => setLinks(links.filter((_, j) => j !== i))}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-destructive transition hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setLinks([...links, { label: "", url: "" }])}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-white/15 px-3 py-2 text-xs text-foreground/80 transition hover:bg-white/5"
          >
            <Plus className="h-3.5 w-3.5" /> Add link
          </button>
        </div>
      </Field>

      <button
        type="submit" disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 glow"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
