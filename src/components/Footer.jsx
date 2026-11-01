export default function Footer({ openAbout, openContact }) {
  return (
    <footer className="mt-auto bg-[#17251d] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-extrabold">
            Tandoori <span className="text-[#f2a93b]">Tales</span>
          </p>
          <p className="mt-1 text-sm text-white/60">Where every bite tells a story.</p>
        </div>
        <div className="flex gap-6 text-sm font-semibold">
          <button onClick={openAbout} className="text-white/75 hover:text-white">About us</button>
          <button onClick={openContact} className="text-white/75 hover:text-white">Contact</button>
        </div>
        <p className="text-sm text-white/50">© 2026 Tandoori Tales</p>
      </div>
    </footer>
  );
}
