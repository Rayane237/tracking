import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-brand-soft px-4 text-center">
      <div className="rounded-[2rem] border border-brand-line bg-white p-8 shadow-premium">
        <Logo className="mx-auto h-14 w-auto" showText={false} />
        <h1 className="mt-6 text-3xl font-extrabold text-brand-dark">Page introuvable</h1>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white">
          Retour accueil
        </Link>
      </div>
    </div>
  );
}

