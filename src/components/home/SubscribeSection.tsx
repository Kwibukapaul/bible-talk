import { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AnimatedSection } from '../ui/AnimatedSection';

export function SubscribeSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    const { error: err } = await supabase.from('subscribers').insert({ email, name });
    setLoading(false);
    if (err) {
      if (err.code === '23505') setError('This email is already subscribed!');
      else setError('Something went wrong. Please try again.');
    } else {
      setSuccess(true);
      setEmail('');
      setName('');
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent" />
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-amber-400/10 animate-spin-slow"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animationDuration: `${20 + i * 8}s`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-6">
            <Mail size={12} />
            Stay Connected
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Subscribe to{' '}
            <span className="shimmer-text">The Word</span>
          </h2>
          <p className="text-slate-400 text-base mb-8 leading-relaxed">
            Join our community and receive the latest Bible studies, devotionals,
            testimonies, and updates directly in your inbox.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          {success ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse-gold">
                <Check size={28} className="text-emerald-400" />
              </div>
              <p className="text-emerald-400 font-semibold text-lg">You're subscribed!</p>
              <p className="text-slate-400 text-sm">May God bless you richly. We'll keep you updated.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-dark"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-dark"
                />
              </div>
              {error && <p className="text-rose-400 text-sm mb-3 text-left">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Subscribing...
                  </span>
                ) : (
                  <>
                    <Send size={14} />
                    Subscribe Now
                  </>
                )}
              </button>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
