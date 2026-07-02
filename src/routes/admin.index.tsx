import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { categoryStyles, type Post } from "@/lib/posts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminList,
});

function AdminList() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Post[];
    },
  });

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    qc.invalidateQueries({ queryKey: ["admin-posts"] });
    qc.invalidateQueries({ queryKey: ["posts"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your posts</p>
        </div>
        <Link
          to="/admin/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 glow"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No posts yet. Create your first one.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {data.map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-4">
                <span
                  className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${categoryStyles[p.category]}`}
                >
                  {p.category}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to="/admin/edit/$id" params={{ id: p.id }}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => remove(p.id)}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-destructive transition hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
