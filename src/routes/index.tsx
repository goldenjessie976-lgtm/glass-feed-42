import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type Post, type PostCategory } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { SiteNav } from "@/components/site-nav";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

type Filter = PostCategory | "all";

function Index() {
  const [filter, setFilter] = useState<Filter>("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Post[];
    },
  });

  const filtered = posts?.filter((p) => filter === "all" || p.category === filter) ?? [];

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:pt-16">
        <section className="mb-10 text-center sm:mb-14">
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
             <span className="text-gradient">Jessie Gaming Casino</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-base text-foreground/70 sm:text-lg">
            This is our help center for the Jessie Gaming Casino.
            We will be putting out all the information you need to know about the casino here.
          </p>
        </section>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.value} active={filter === c.value} onClick={() => setFilter(c.value)}>
              {c.label}
            </Chip>
          ))}
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
            No posts yet.
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}

function Chip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-primary/50 bg-primary text-primary-foreground glow"
          : "glass text-foreground/80 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
