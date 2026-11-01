import { UserIcon } from "./Icons";

export default function ProfileModal({ user, close, openOrders, onLogout, onDeleteAccount }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-[#17251d] shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#17251d] text-[#f2a93b]">
            <UserIcon width={24} height={24} />
          </span>
          <div className="min-w-0">
            <h2 className="font-display truncate text-xl font-bold">{user.name}</h2>
            <p className="truncate text-sm text-[#6b7468]">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {user.role !== "admin" && (
            <button onClick={openOrders} className="w-full rounded-md bg-[#17251d] py-3 font-bold text-white hover:bg-[#22372b]">
              My orders
            </button>
          )}
          <button onClick={onLogout} className="w-full rounded-md border border-[#17251d] py-3 font-bold hover:bg-[#f6f5ef]">
            Log out
          </button>
          <button onClick={onDeleteAccount} className="w-full rounded-md py-3 text-sm font-semibold text-[#c23b22] hover:bg-[#c23b22]/10">
            Delete account
          </button>
        </div>

        <button onClick={close} className="mt-3 w-full text-sm text-[#6b7468] hover:text-[#17251d]">
          Close
        </button>
      </div>
    </div>
  );
}
