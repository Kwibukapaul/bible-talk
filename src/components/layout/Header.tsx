import { useState, useEffect } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { useRouter } from "../../hooks/useRouter";

const NAV_LINKS = [
  { label: "Home", route: "/" as const },
  { label: "Blog", route: "/blog" as const },
  { label: "Books", route: "/books" as const },
  { label: "Videos", route: "/videos" as const },
];

export function Header() {
  const { route, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080d1a]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-amber-400/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-300">
                <BookOpen size={16} className="text-amber-400" />
              </div>
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm group-hover:blur-md transition-all duration-300" />
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-wide">
                Bible
              </span>
              <span className="shimmer-text font-bold text-base"> Talk</span>
              <span className="text-white font-bold text-base tracking-wide">
                {" "}
                Blog
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, route: r }) => (
              <button
                key={r}
                onClick={() => navigate(r)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  route === r
                    ? "text-amber-400 bg-amber-400/10"
                    : "text-slate-300 hover:text-amber-300 hover:bg-amber-400/5"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => navigate("/admin/login")}
              className="ml-3 px-4 py-2 rounded-lg text-sm font-medium text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 hover:border-amber-400/60 transition-all duration-200"
            >
              Admin
            </button>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0e1628]/98 backdrop-blur-md border-b border-amber-400/10 animate-fade-in-up">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ label, route: r }) => (
              <button
                key={r}
                onClick={() => {
                  navigate(r);
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  route === r
                    ? "text-amber-400 bg-amber-400/10"
                    : "text-slate-300 hover:text-amber-300 hover:bg-amber-400/5"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate("/admin/login");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-400/10 transition-all"
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
