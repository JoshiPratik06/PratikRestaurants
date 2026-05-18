import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="Delicious food spread"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* ✅ Improved: gradient overlay instead of flat black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-white px-6 max-w-3xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 backdrop-blur-sm text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          🔥 Authentic Indian Cuisine
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent leading-tight">
          Tandoori Tales
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-4 font-light">
          Where Every Bite Tells a Story 🍽️
        </p>

        <p className="text-sm md:text-base text-gray-400 mb-10 max-w-lg mx-auto">
          Fresh ingredients, bold flavors, and the warmth of a home kitchen — delivered to your door.
        </p>

        {/* ✅ Stats Bar */}
        <div className="flex justify-center gap-10 mb-10 flex-wrap">
          {[
            { value: "50+", label: "Dishes" },
            { value: "4.8★", label: "Rating" },
            { value: "30 min", label: "Delivery" },
            { value: "100%", label: "Fresh" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-orange-400">{stat.value}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ✅ Dual CTA Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/menu")}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/40 hover:opacity-90 hover:scale-105 transition-all duration-300"
          >
            🍽️ Order Now
          </button>
          <button
            onClick={() => navigate("/menu")}
            className="border border-white/60 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
          >
            🔍 View Dishes
          </button>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex justify-center">
          <div className="flex flex-col items-center gap-1 text-white/30 text-xs animate-bounce">
            <span>↓</span>
            <span>scroll</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Hero;