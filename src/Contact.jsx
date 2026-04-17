function Contact({ close }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="relative bg-slate-950 text-white w-full max-w-[600px] max-h-[85vh] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 border border-slate-800 flex flex-col">

        <button
          onClick={close}
          className="absolute top-6 right-6 text-slate-300 hover:text-white text-2xl hover:bg-white/10 rounded-full p-2 transition z-10"
          aria-label="Close contact"
        >
          ✕
        </button>

        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black px-8 py-8 text-white border-b border-slate-800">
          <h2 className="text-4xl font-bold">Contact Us</h2>
          <p className="mt-2 text-slate-300 text-lg">We'd love to hear from you! 📞</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Quick Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:shadow-lg shadow-black/20 transition">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-bold text-white mb-2">Phone</h3>
              <a href="tel:+919876543210" className="text-orange-400 hover:text-orange-300 font-semibold">
                +91 9876543210
              </a>
              <p className="text-sm text-slate-400 mt-2">Available 24/7 for orders</p>
            </div>

            {/* Email */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:shadow-lg shadow-black/20 transition">
              <div className="text-4xl mb-3">✉️</div>
              <h3 className="font-bold text-white mb-2">Email</h3>
              <a href="mailto:support@tandooritales.com" className="text-orange-400 hover:text-orange-300 font-semibold">
                support@tandooritales.com
              </a>
              <p className="text-sm text-slate-400 mt-2">We'll respond within 2 hours</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span>📍</span> Our Location
            </h3>
            <div className="space-y-2 text-slate-300">
              <p className="font-semibold text-white">Tandoori Tales Restaurant</p>
              <p>123 Food Street, Restaurant Lane</p>
              <p>Downtown City, State - 123456</p>
              <p className="text-sm text-slate-400 mt-2">Opposite Central Park</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🕐</span> Operating Hours
            </h3>
            <div className="space-y-2">
              {[
                ['Monday - Thursday', '10:00 AM - 11:00 PM'],
                ['Friday - Saturday', '10:00 AM - 12:00 AM'],
                ['Sunday', '11:00 AM - 11:00 PM'],
              ].map((hours, i) => (
                <div key={i} className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="font-medium text-slate-300">{hours[0]}</span>
                  <span className="text-orange-400 font-semibold">{hours[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🌐</span> Follow Us
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((social, i) => (
                <button
                  key={i}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold transition"
                >
                  <span>{['f', '📷', '𝕏', '▶'][i]}</span> {social}
                </button>
              ))}
            </div>
          </div>

          {/* Message Form */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💬</span> Send Message
            </h3>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 font-semibold shadow-lg shadow-orange-400/20 hover:opacity-95 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;