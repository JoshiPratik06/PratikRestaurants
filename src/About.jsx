function About({ close }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="relative bg-slate-950 text-white w-full max-w-[600px] max-h-[85vh] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 border border-slate-800 flex flex-col">

        <button
          onClick={close}
          className="absolute top-6 right-6 text-slate-300 hover:text-white text-2xl hover:bg-white/10 rounded-full p-2 transition z-10"
          aria-label="Close about"
        >
          ✕
        </button>

        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black px-8 py-8 text-white border-b border-slate-800">
          <h2 className="text-4xl font-bold">About Tandoori Tales</h2>
          <p className="mt-2 text-slate-300 text-lg">Where Every Bite Tells a Story 🍽️</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Mission */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Our Mission
            </h3>
            <p className="text-slate-300 leading-relaxed">
              At Tandoori Tales, we're passionate about bringing authentic Tandoori cuisine to your table. Our mission is to serve delicious, high-quality food with the warmth of traditional cooking and the convenience of modern delivery.
            </p>
          </div>

          {/* Why Choose Us */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⭐</span> Why Choose Us
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex gap-3 items-start">
                <span className="text-orange-400 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-white">Authentic Recipes</p>
                  <p className="text-sm text-slate-300">Traditional tandoori cooking methods passed down through generations</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-orange-400 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-white">Fresh Ingredients</p>
                  <p className="text-sm text-slate-300">Only the finest quality ingredients sourced daily</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-orange-400 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-white">Fast Delivery</p>
                  <p className="text-sm text-slate-300">Hot and fresh meals delivered to your doorstep quickly</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-orange-400 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-white">Affordable Prices</p>
                  <p className="text-sm text-slate-300">Premium quality food at reasonable prices for everyone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🔥</span> Our Specialties
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Tandoori Chicken', 'Paneer Tandoori', 'Seekh Kebab', 'Veggie Starters', 'Butter Chicken', 'Naan Varieties'].map((item, i) => (
                <div key={i} className="bg-slate-900 rounded-2xl px-4 py-3 text-center border border-slate-800">
                  <p className="font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">👨‍🍳</span> Our Team
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Our team consists of experienced chefs with years of expertise in traditional tandoori cuisine. We're committed to maintaining the highest standards of food quality and customer service.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-xl">🌟</span> Our Vision
            </h3>
            <p className="text-slate-300">
              To become the most trusted and loved restaurant brand, known for our authentic flavors, exceptional service, and commitment to customer satisfaction.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;