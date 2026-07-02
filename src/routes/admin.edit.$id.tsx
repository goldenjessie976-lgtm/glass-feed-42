import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "@/components/post-form";
import type { Post } from "@/lib/posts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/edit/$id")({
  component: EditPostPage,
});

function EditPostPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (error) throw error;
      return data as unknown as Post;
    },
  });

  return (
    <div className="space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="font-display text-3xl font-semibold">Edit post</h1>

      {isLoading || !data ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : (
        <PostForm
          initial={data}
          submitLabel="Save changes"
          onSubmit={async (v) => {
            const { error } = await supabase.from("posts").update({
              title: v.title,
              content: v.content,
              category: v.category,
              image_url: v.image_url || null,
              links: v.links,
            }).eq("id", id);
            if (error) return toast.error(error.message);
            toast.success("Post updated");
            navigate({ to: "/admin" });
          }}
        />
      )}
    </div>
  );
}
