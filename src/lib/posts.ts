export type PostCategory = "announcement" | "issue" | "message";

export type PostLink = { label: string; url: string };

export type Post = {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  image_url: string | null;
  links: PostLink[];
  created_at: string;
  updated_at: string;
  author_id: string | null;
};

export const CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: "announcement", label: "Announcement" },
  { value: "issue", label: "Issue" },
  { value: "message", label: "Message" },
];

export const categoryStyles: Record<PostCategory, string> = {
  announcement: "bg-primary/15 text-primary border-primary/30",
  issue: "bg-destructive/15 text-destructive border-destructive/30",
  message: "bg-secondary/15 text-secondary border-secondary/30",
};
