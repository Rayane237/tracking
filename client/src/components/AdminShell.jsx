
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, LogOut, PackagePlus, ShipWheel } from 'lucide-react';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';


const navItems = [
  {
    to: '/admin',
    label: 'Tableau de bord',
    icon: BarChart3,
  },
  {
    to: '/admin/commandes',
    label: 'Commandes',
    icon: ShipWheel,
  },
  {
    to: '/admin/commandes/nouvelle',
    label: 'Nouvelle commande',
    icon: PackagePlus,
  },
];


export default function AdminShell({ children }) {

  const { logout, user } = useAuth();
  const navigate = useNavigate();


  function handleLogout() {
    logout();
    navigate('/admin/login');
  }


  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-200">


      {/* SIDEBAR DESKTOP */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-30
          hidden
          w-72
          border-r
          border-white/20
          bg-slate-900/95
          p-6
          shadow-2xl
          backdrop-blur-xl
          lg:block
        "
      >

        <Link to="/admin">
          <Logo />
        </Link>


        <nav className="mt-10 space-y-2">


          {navItems.map(({ to, label, icon: Icon }) => (

            <NavLink

              key={to}

              to={to}

              end={to === '/admin'}

              className={({ isActive }) =>

                `
                flex items-center gap-3 rounded-2xl px-4 py-3
                text-sm font-bold transition

                ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 shadow-lg'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }
                `

              }

            >

              <Icon size={19}/>

              {label}

            </NavLink>

          ))}


        </nav>




        {/* USER CARD */}

        <div
          className="
            absolute
            bottom-6
            left-6
            right-6
            rounded-3xl
            border
            border-white/10
            bg-white/10
            p-5
            text-white
            backdrop-blur
          "
        >

          <p className="text-xs uppercase tracking-[0.22em] text-white/40">
            Connecté
          </p>


          <p className="mt-2 font-black">
            {user?.name || 'Administrateur'}
          </p>



          <button

            type="button"

            onClick={handleLogout}

            className="
              mt-4
              flex
              items-center
              gap-2
              text-sm
              font-bold
              text-cyan-300
              hover:text-white
            "

          >

            <LogOut size={16}/>

            Déconnexion

          </button>


        </div>


      </aside>





      {/* MOBILE HEADER */}

      <header
        className="
          sticky
          top-0
          z-20
          border-b
          border-white/30
          bg-cyan-100/80
          px-4
          py-3
          backdrop-blur-xl
          lg:hidden
        "
      >


        <div className="flex items-center justify-between">


          <Logo/>


          <button

            type="button"

            onClick={handleLogout}

            className="
              rounded-full
              bg-slate-900
              px-4
              py-2
              text-xs
              font-black
              text-white
            "

          >

            Sortir

          </button>


        </div>





        <nav className="mt-4 flex gap-2 overflow-x-auto">


          {navItems.map(({ to, label }) => (

            <NavLink

              key={to}

              to={to}

              end={to === '/admin'}

              className={({ isActive }) =>

                `
                shrink-0 rounded-full px-4 py-2
                text-xs font-black transition

                ${
                  isActive
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/70 text-slate-700'
                }

                `

              }

            >

              {label}

            </NavLink>

          ))}


        </nav>


      </header>





      {/* CONTENU */}

      <main className="lg:pl-72">


        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            py-6
            sm:px-6
            lg:px-8
          "
        >

          {children}

        </div>


      </main>


    </div>

  );

}
