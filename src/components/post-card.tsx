import { ExternalLink, Megaphone, AlertTriangle, MessageSquare } from "lucide-react";
import { categoryStyles, type Post, type PostCategory } from "@/lib/posts";

const icons: Record<PostCategory, typeof Megaphone> = {
  announcement: Megaphone,
  issue: AlertTriangle,
  message: MessageSquare,
};

export function PostCard({ post }: { post: Post }) {
  const Icon = icons[post.category];
  const date = new Date(post.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="glass overflow-hidden rounded-2xl transition hover:border-white/20">
      {post.image_url && (
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${categoryStyles[post.category]}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {post.category}
          </span>
          <time className="text-xs text-muted-foreground">{date}</time>
        </div>

        <h2 className="font-display text-xl font-semibold leading-tight sm:text-2xl">
          {post.title}
        </h2>

        {post.content && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
            {post.content}
          </p>
        )}

        {post.links?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                {l.label}
                <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
