import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck } from 'lucide-react';
import http from '../api/http.js';

export default function TrackingSearch({ compact = false }) {

  const navigate = useNavigate();

  const [trackingCode, setTrackingCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  function handleSubmit(event) {

    event.preventDefault();


    const code = trackingCode.trim().toUpperCase();


    if (!code) {

      setError('Veuillez entrer un code de suivi.');

      return;

    }


    setError('');

    setLoading(true);


    navigate(`/suivi/${code}`);

  }



  return (

    <form
      onSubmit={handleSubmit}
      className={`rounded-[2rem] border border-brand-line bg-white p-3 shadow-premium ${
        compact ? '' : 'max-w-2xl'
      }`}
    >


      <div className="flex flex-col gap-3 sm:flex-row">


        <div className="relative flex-1">


          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />


          <input

            value={trackingCode}

            onChange={(event) => {

              setTrackingCode(event.target.value);

              setError('');

            }}

            placeholder="Code de suivi : DGE-2026-XXXX"

            autoComplete="off"

            className="
              h-14 w-full rounded-2xl
              border border-brand-line
              bg-slate-50
              pl-12 pr-4
              text-sm font-bold uppercase
              text-brand-dark
              outline-none
              transition
              focus:border-brand-red
              focus:bg-white
              focus:ring-4
              focus:ring-red-100
            "

          />


        </div>



        <button

          type="submit"

          disabled={loading}

          className="
            flex h-14 items-center justify-center gap-2
            rounded-2xl
            bg-brand-red
            px-7
            text-sm
            font-black
            uppercase
            tracking-wide
            text-white
            shadow-glow
            transition
            hover:-translate-y-0.5
            disabled:opacity-70
          "

        >

          <Search size={18}/>

          {loading ? "Recherche..." : "Suivre"}

        </button>


      </div>





      {error && (

        <p

          role="alert"

          className="
            mt-3
            rounded-xl
            bg-red-50
            px-3
            py-2
            text-sm
            font-bold
            text-brand-red
          "

        >

          {error}

        </p>

      )}





      {!compact && (

        <div

          className="
            mt-4
            flex
            items-center
            gap-2
            px-2
            text-xs
            font-semibold
            text-slate-500
          "

        >

          <ShieldCheck

            size={17}

            className="text-emerald-500"

          />

          Suivi sécurisé et informations mises à jour par Dubai Global Express.

        </div>

      )}


    </form>

  );

}
