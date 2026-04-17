import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!user || user.role !== "admin") {
    setLoading(false);
    return;
  }

  try {
    // ✅ get users
    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    // ✅ get orders
    const storedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    // ✅ attach user info to orders
    const ordersWithUser = storedOrders.map((order) => {
      const orderUser = storedUsers.find(
        (u) => u.id === order.user_id
      );

      return {
        ...order,
        user_name: orderUser?.name || "Unknown",
        user_email: orderUser?.email || "Unknown",
        items: order.items || [],
      };
    });

    // ✅ stats
    const totalUsers = storedUsers.length;
    const totalOrders = storedOrders.length;
    const totalRevenue = storedOrders.reduce(
      (sum, o) => sum + o.total,
      0
    );

    setStats({
      totalUsers,
      totalOrders,
      totalRevenue,
    });

    setUsers(storedUsers);
    setOrders(ordersWithUser);

  } catch (err) {
    console.error(err);
    setError("Failed to load local data");
  } finally {
    setLoading(false);
  }
}, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-slate-800 bg-slate-900/95 shadow-2xl shadow-black/40 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black px-10 py-10 border-b border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Admin Dashboard</p>
              <h1 className="text-4xl font-extrabold">Tandoori Tales Control</h1>
              <p className="mt-2 text-slate-300 max-w-2xl">
                Manage users, orders, and platform metrics from one place.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 hover:bg-orange-400 transition"
            >
              Back to Store
            </Link>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {loading ? (
            <div className="rounded-[1.5rem] bg-slate-950 border border-slate-800 p-8 text-center">
              <p className="text-lg font-semibold">Loading admin data...</p>
            </div>
          ) : error ? (
            <div className="rounded-[1.5rem] bg-slate-950 border border-red-500 p-8 text-center">
              <p className="text-lg font-semibold text-red-400">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-6">
                  <p className="text-sm text-slate-400 uppercase tracking-[0.24em] mb-3">Total Users</p>
                  <p className="text-4xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-6">
                  <p className="text-sm text-slate-400 uppercase tracking-[0.24em] mb-3">Total Orders</p>
                  <p className="text-4xl font-bold text-white">{stats.totalOrders}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-6">
                  <p className="text-sm text-slate-400 uppercase tracking-[0.24em] mb-3">Revenue</p>
                  <p className="text-4xl font-bold text-orange-400">₹{stats.totalRevenue}</p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-2xl font-bold">Recent Users</h2>
                      <p className="text-sm text-slate-400">Newest registered accounts</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {users.slice(0, 6).map((account) => (
                      <div key={account.id} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900 p-4">
                        <div>
                          <p className="font-semibold text-white">{account.name}</p>
                          <p className="text-sm text-slate-500">{account.email}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                          {account.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-2xl font-bold">Latest Orders</h2>
                      <p className="text-sm text-slate-400">Most recent order activity</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 6).map((order) => (
                      <div key={order.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm text-slate-400">Order #{order.id}</p>
                            <p className="text-sm text-slate-300">{order.user_name} · {order.user_email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-orange-400">₹{(order.total * 1.05).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                              <p className="text-xs text-slate-500">+GST (5%)</p>
                            </div>
                            <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-200 font-semibold">
                              {order.payment_method || "Netbanking"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 text-sm text-slate-400">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <p key={idx}>• {item.name} ×{item.quantity}</p>
                          ))}
                          {order.items.length > 3 && <p>+ {order.items.length - 3} more items</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
