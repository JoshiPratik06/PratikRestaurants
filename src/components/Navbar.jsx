import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ cartCount, openCart, openRegister, openLogin, openProfile, user, isAdmin, isLoggedIn, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-900 to-black text-white px-6 py-4 flex justify-between items-center shadow-xl border-b border-orange-500/20 sticky top-0 z-30">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wider bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent hover:opacity-90 transition"
        >
          Tandoori Tales 🔥
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              isActive("/") ? "bg-white/15 text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            🏠 Home
          </Link>
          <Link
            to="/menu"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              isActive("/menu") ? "bg-white/15 text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            🍽️ Menu
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isActive("/admin") ? "bg-slate-700 text-white" : "bg-slate-800/80 text-slate-100 hover:bg-slate-700"
              }`}
            >
              🛠️ Admin Panel
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Profile / Auth — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={openProfile}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                <span className="text-lg">👤</span>
                <span className="font-medium text-sm">{user.name}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={openRegister}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  Register
                </button>
                <button
                  onClick={openLogin}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-orange-500/30 hover:opacity-95 transition"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white text-xl hover:bg-white/10 px-2 py-1.5 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-b border-orange-500/20 px-6 py-4 flex flex-col gap-3 z-20 relative">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`py-2 font-semibold text-sm transition ${isActive("/") ? "text-orange-400" : "text-slate-300 hover:text-orange-400"}`}
          >
            🏠 Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileOpen(false)}
            className={`py-2 font-semibold text-sm transition ${isActive("/menu") ? "text-orange-400" : "text-slate-300 hover:text-orange-400"}`}
          >
            🍽️ Menu
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="py-2 text-slate-300 hover:text-orange-400 font-semibold text-sm transition"
            >
              🛠️ Admin Panel
            </Link>
          )}
          <div className="border-t border-slate-700 pt-3 mt-1 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => { openProfile(); setMobileOpen(false); }}
                className="text-left py-2 text-slate-300 hover:text-orange-400 font-semibold text-sm transition"
              >
                👤 {user.name}
              </button>
            ) : (
              <>
                <button
                  onClick={() => { openRegister(); setMobileOpen(false); }}
                  className="text-left py-2 text-slate-300 hover:text-orange-400 font-semibold text-sm"
                >
                  Register
                </button>
                <button
                  onClick={() => { openLogin(); setMobileOpen(false); }}
                  className="text-left py-2 text-orange-400 hover:text-orange-300 font-semibold text-sm"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}