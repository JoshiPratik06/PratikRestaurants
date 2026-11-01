import { useNavigate } from "react-router-dom";
import heroImg from "../assets/tandoorichicken.jpg";

export default function Hero() {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate("/menu");
    const scrollWhenReady = (attempt = 0) => {
      const menuSection = document.getElementById("menu-section");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempt < 12) setTimeout(() => scrollWhenReady(attempt + 1), 80);
    };
    setTimeout(() => scrollWhenReady(), 80);
  };

  return (
    <section className="bg-[#17251d] text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl">
            Fresh from the tandoor, at your door in 30 minutes.
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/70">
            Curries, kebabs and breads cooked to order. Pick your dishes, pay online, and we deliver them hot.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={goToMenu}
              className="rounded-md bg-[#f2a93b] px-7 py-3.5 font-bold text-[#17251d] transition-transform hover:scale-[1.03] active:scale-95"
            >
              Order now
            </button>
            <span className="text-sm text-white/60">Rated 4.8 by our regulars</span>
          </div>
        </div>

        <div className="relative">
          <img
            src={heroImg}
            alt="Tandoori chicken fresh from the oven"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
          <div className="absolute -bottom-4 left-4 rounded-lg bg-white px-4 py-3 text-[#17251d] shadow-lg">
            <p className="font-display text-lg font-bold leading-tight">Tandoori Chicken</p>
            <p className="text-sm text-[#6b7468]">Our most ordered starter</p>
          </div>
        </div>
      </div>
    </section>
  );
}
