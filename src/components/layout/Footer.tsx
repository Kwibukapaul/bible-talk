import { BookOpen, Heart, Mail, Youtube } from "lucide-react";
import { useRouter } from "../../hooks/useRouter";

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#060b17] border-t border-amber-400/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-amber-400" />
              <span className="text-white font-bold">Bible Talk Blog</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A place of faith, reflection, and community. Sharing the living
              word of God through Bible studies, testimonies, devotionals, and
              more.
            </p>
            <p className="mt-4 text-amber-400/70 text-xs italic">
              "Thy word is a lamp unto my feet, and a light unto my path." —
              Psalm 119:105
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold text-sm uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", route: "/" as const },
                { label: "Blog & Studies", route: "/blog" as const },
                { label: "Books Library", route: "/books" as const },
                { label: "Video Sessions", route: "/videos" as const },
              ].map(({ label, route }) => (
                <li key={route}>
                  <button
                    onClick={() => navigate(route)}
                    className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold text-sm uppercase tracking-widest mb-4">
              Connect
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <Mail size={14} className="text-amber-400/70" />
                <span>bibletalk@email.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <Youtube size={14} className="text-amber-400/70" />
                <span>YouTube Channel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-amber-400/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Bible Talk Blog. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-slate-500 text-xs">
            Made with <Heart size={11} className="text-amber-400" /> for His
            glory
          </p>
        </div>
      </div>
    </footer>
  );
}
