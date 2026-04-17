import { useEffect, useState } from "react";

function Orders({ close, user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // ✅ Get orders from localStorage
      const allOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      let filteredOrders = [];

      if (user.role === "admin") {
        // ✅ Admin sees all orders
        filteredOrders = allOrders;
      } else {
        // ✅ User sees only their orders
        filteredOrders = allOrders.filter(
          (order) => order.user_id === user.id
        );
      }

      // ✅ Latest first
      setOrders(filteredOrders.reverse());
      setLoading(false);

    } catch (err) {
      console.error(err);
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  const totalSpent = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="relative bg-slate-950 text-white w-full max-w-[600px] max-h-[85vh] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 border border-slate-800 flex flex-col">

        <button
          onClick={close}
          className="absolute top-6 right-6 text-slate-300 hover:text-white text-2xl hover:bg-white/10 rounded-full p-2 transition z-10"
        >
          ✕
        </button>

        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black px-8 py-8 border-b border-slate-800">
          <p className="text-sm text-slate-400 font-medium">Order Center</p>
          <h2 className="text-4xl font-bold mt-1">Your Orders</h2>

          <div className="mt-5 grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-900/70 rounded-3xl py-4 px-3 border border-slate-800">
              <p className="text-3xl font-bold">{orders.length}</p>
              <p className="text-xs text-slate-400 uppercase tracking-[0.18em]">
                Total Orders
              </p>
            </div>

            <div className="bg-slate-900/70 rounded-3xl py-4 px-3 border border-slate-800">
              <p className="text-3xl font-bold text-orange-400">
                ₹{totalSpent}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-[0.18em]">
                Total Spent
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4">

          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center">
              <p className="text-lg font-semibold">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-8 text-center">
              <p className="text-5xl mb-4">🛒</p>
              <p className="text-xl font-semibold mb-2">
                No orders yet
              </p>
              <p className="text-sm text-slate-400">
                Place your first order and it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {

                // ✅ FIX: items already object (no JSON.parse)
                const items = order.items || [];

                // ✅ FIX: use stored date
                const orderDate = new Date(order.date);

                const formattedDate = orderDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                const formattedTime = orderDate.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={order.id}
                    className="rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-5 shadow-sm"
                  >

                    <div className="flex justify-between items-center">

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                          #{orders.length - index}
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            Order #{order.id}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formattedDate} · {formattedTime}
                          </p>
                        </div>
                      </div>

                      <span className="text-green-400 text-xs">
                        ✓ Completed
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-bold text-orange-400">
                        ₹{order.total}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Orders;