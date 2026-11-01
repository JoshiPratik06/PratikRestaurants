import { Link, useLocation } from "react-router-dom";
import { CartIcon, UserIcon } from "./Icons";

const linkCls = (active) =>
  `px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
    active ? "text-[#f2a93b]" : "text-white/75 hover:text-white"
  }`;

export default function Navbar({ cartCount, openCart, openRegister, openLogin, openProfile, user, isAdmin }) {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-[#17251d] text-white border-b border-white/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-xl font-extrabold text-white">
          Tandoori <span className="text-[#f2a93b]">Tales</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/menu" className={linkCls(pathname === "/menu")}>Menu</Link>
          {isAdmin && (
            <Link to="/admin" className={linkCls(pathname === "/admin")}>Admin</Link>
          )}

          {user ? (
            <button
              onClick={openProfile}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white/85 hover:text-white"
            >
              <UserIcon />
              <span className="hidden sm:inline">{user.name}</span>
            </button>
          ) : (
            <>
              <button onClick={openRegister} className={linkCls(false)}>Register</button>
              <button
                onClick={openLogin}
                className="rounded-md border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Log in
              </button>
            </>
          )}

          <button
            onClick={openCart}
            aria-label={`Open cart, ${cartCount} items`}
            className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#f2a93b] text-[#17251d] transition-transform hover:scale-105 active:scale-95"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 min-w-[1.25rem] rounded-full bg-[#c23b22] px-1 text-center text-[11px] font-bold leading-5 text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
