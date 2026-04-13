import { useState } from "react";
import { BookOpen, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRouter } from "../hooks/useRouter";

export function AdminLoginPage() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#060b17] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]" />
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-amber-400/10 animate-spin-slow"
          style={{
            width: `${200 + i * 120}px`,
            height: `${200 + i * 120}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animationDuration: `${15 + i * 7}s`,
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 glow-gold">
            <BookOpen size={24} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to manage Bible Talk Blog
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 animate-fade-in-up delay-100">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-dark pl-9"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-dark pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-amber-400/10">
            <p className="text-slate-500 text-xs text-center">
              Access restricted to authorized administrators only.
            </p>
          </div>
        </div>

        <p className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 text-sm hover:text-amber-400 transition-colors"
          >
            ← Back to website
          </button>
        </p>
      </div>
    </div>
  );
}
