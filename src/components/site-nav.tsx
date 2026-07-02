import { Link } from "@tanstack/react-router";
import { Sparkles, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SiteNav() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-3xl items-center justify-between rounded-2xl px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-gradient">Jessie Gaming Casino</span>
        </Link>
        <div className="flex items-center gap-1.5 text-sm">
          {user ? (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-foreground/80 transition hover:bg-white/5 hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" /> Admin
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-foreground/80 transition hover:bg-white/5 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-foreground/80 transition hover:bg-white/5 hover:text-foreground"
            >
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
