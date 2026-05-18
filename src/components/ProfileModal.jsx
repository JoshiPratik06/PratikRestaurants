function ProfileModal({ user, close, openOrders, onLogout, onDeleteAccount }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-slate-950 text-white p-6 rounded-[2rem] w-full max-w-sm border border-slate-800 shadow-2xl shadow-black/40">
        <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
        <p className="text-slate-300"><b>Name:</b> {user.name}</p>
        <p className="text-slate-300 mb-4"><b>Email:</b> {user.email}</p>
        {user.role !== "admin" && (
          <button
            onClick={openOrders}
            className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold"
          >
            📦 My Orders
          </button>
        )}
        <button
          onClick={onDeleteAccount}
          className="w-full mt-3 bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-400 transition"
        >
          🗑️ Delete Account
        </button>
        <button
          onClick={onLogout}
          className="w-full mt-3 bg-red-500 text-white py-3 rounded-xl font-semibold"
        >
          Logout
        </button>
        <button onClick={close} className="mt-4 w-full text-slate-400 hover:text-white">
          Close
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;