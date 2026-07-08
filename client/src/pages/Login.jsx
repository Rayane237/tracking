import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(form);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-brand-soft lg:grid-cols-[1fr_.85fr]">
      <section className="relative hidden overflow-hidden bg-brand-dark p-10 text-white lg:block">
        <div className="absolute inset-0 bg-hero-grid bg-[size:44px_44px] opacity-20" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <Logo className="h-14 w-auto brightness-0 invert" />
          <div>
            <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/70">
              Dubai Global Express Admin
            </p>
            <h1 className="max-w-xl text-5xl font-extrabold tracking-tight">
              Gestion premium des commandes et cargaisons.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">
              Creez les codes de suivi, mettez a jour les escales et donnez aux clients une
              experience claire et professionnelle.
            </p>
          </div>
          <p className="text-sm text-white/40">Interface securisee par JWT.</p>
        </div>
      </section>

      <main className="flex items-center justify-center px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] border border-brand-line bg-white p-8 shadow-premium">
          <Link to="/" className="inline-flex">
            <Logo />
          </Link>
          <div className="mt-8 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-brand-red">
            <LockKeyhole size={26} />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold text-brand-dark">Connexion admin</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Accedez au tableau de bord Dubai Global Express.
          </p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-brand-graphite">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="mt-2 h-12 w-full rounded-2xl border border-brand-line px-4 text-sm font-semibold outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-brand-graphite">Mot de passe</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="mt-2 h-12 w-full rounded-2xl border border-brand-line px-4 text-sm font-semibold outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100"
                required
              />
            </label>
          </div>

          {error && <p className="mt-4 text-sm font-bold text-brand-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 h-14 w-full rounded-2xl bg-brand-red px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-glow transition hover:-translate-y-0.5 disabled:opacity-70"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </main>
    </div>
  );
}
