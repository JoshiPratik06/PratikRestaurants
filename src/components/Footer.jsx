function Footer({ openAbout, openContact }) {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-black text-white py-10 mt-auto border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Tandoori Tales
            </h3>
            <p className="text-slate-400 text-sm">Where Every Bite Tells a Story</p>
          </div>
          <div className="flex justify-center gap-8">
            <button onClick={openAbout} className="text-slate-300 hover:text-orange-400 transition font-semibold">About Us</button>
            <button onClick={openContact} className="text-slate-300 hover:text-orange-400 transition font-semibold">Contact</button>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm mb-2">Follow Us</p>
            <div className="flex justify-end gap-2">
              {["f", "📷", "𝕏", "▶"].map((icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500/40 flex items-center justify-center transition text-sm"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-center">
          <p className="text-slate-400 text-sm">© 2026 Tandoori Tales Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;