import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "@/components/post-form";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/new")({
  component: NewPostPage,
});

function NewPostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="font-display text-3xl font-semibold">New post</h1>

      <PostForm
        submitLabel="Publish post"
        onSubmit={async (v) => {
          const { error } = await supabase.from("posts").insert({
            title: v.title,
            content: v.content,
            category: v.category,
            image_url: v.image_url || null,
            links: v.links,
            author_id: user?.id ?? null,
          });
          if (error) return toast.error(error.message);
          toast.success("Post published");
          navigate({ to: "/admin" });
        }}
      />
    </div>
  );
}
