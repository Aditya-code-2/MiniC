import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { cancelOrder } from "../api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get("/orders");
        // Handle both array response or object with data key
        const orderData = res.data.orders || res.data || [];
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      setLoading(true);
      await cancelOrder(orderId);
      alert("Order cancelled successfully!");
      
      // Refresh orders list
      const res = await API.get("/orders");
      const orderData = res.data.orders || res.data || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order #${order.id || 'N/A'}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #e11d48; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f9fafb; font-weight: bold; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; text-align: right; color: #e11d48; }
            .footer { margin-top: 40px; text-align: center; color: #888; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>E-COM INVOICE</h1>
              <p>Order ID: #${order.id || 'N/A'}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
          </div>
          <p><strong>Shipping Address:</strong><br/> ${order.shippingAddress || 'N/A'}</p>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items || order.orderItems || []).map(item => `
                <tr>
                  <td>${item.productName || item.product?.name || 'Item'}</td>
                  <td>${item.quantity || 1}</td>
                  <td>₹${item.price || item.product?.price || 0}</td>
                  <td>₹${(item.quantity || 1) * (item.price || item.product?.price || 0)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total Amount: ₹${order.totalAmount || order.total || 0}</div>
          <div class="footer">Thank you for shopping with us!</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    // Use a slight delay to ensure styles are applied before printing
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
        <div className="animate-spin text-3xl">🧸</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen font-sans pb-12">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            📦 My Orders
            <span className="text-xs bg-rose-100 text-rose-500 font-bold px-2.5 py-0.5 rounded-full">
              {orders.length}
            </span>
          </h1>
          <Link
            to="/"
            className="text-xs font-bold text-rose-500 hover:underline"
          >
            ← Back to Shop
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm space-y-4">
            <div className="text-5xl">🎁</div>
            <h2 className="text-lg font-extrabold text-gray-800">No Orders Yet!</h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              You haven't placed any orders yet. Check out our miniatures and bring tiny joy to your life!
            </p>
            <Link
              to="/"
              className="inline-block bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md shadow-rose-200 hover:bg-rose-600 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const items = order.items || order.orderItems || [];
              const orderId = order.id || order._id || `ORD-${idx + 1}`;
              const orderDate = order.createdAt 
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recently";

              return (
                <div
                  key={orderId}
                  className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm space-y-3"
                >
                  {/* Top Bar: Order ID, Date & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Order ID: #{String(orderId).slice(-6)}
                      </span>
                      <span className="text-xs font-semibold text-gray-600">
                        Placed on {orderDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-green-50 text-green-600 border border-green-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                        {order.status || "Placed"}
                      </span>
                      <span className="text-xs font-black text-rose-500">
                        ₹{order.totalAmount || order.total || 0}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {items.map((item, itemIdx) => {
                      const product = item.product || item;
                      return (
                        <div
                          key={item.id || itemIdx}
                          className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl"
                        >
                          <img
                            src={
                              product.imageUrl ||
                              "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80"
                            }
                            alt={product.name || "Product"}
                            className="w-12 h-12 object-cover rounded-lg bg-white shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-800 line-clamp-1">
                              {product.name || "Miniature Item"}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium">
                              Qty: {item.quantity || 1} × ₹{product.price || item.price || 0}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery Address Details */}
                  {order.shippingAddress && (
                    <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span className="line-clamp-1">
                          <strong className="text-gray-700">Deliver to:</strong> {order.shippingAddress}
                        </span>
                      </div>
                      
                      {/* Cancel Button (Only if status is PLACED or PROCESSING) */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handlePrintInvoice(order)}
                          className="bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 px-3 py-1 rounded text-[10px] font-bold"
                        >
                          🖨️ Invoice
                        </button>
                        {(order.status === "PLACED" || order.status === "PROCESSING") && (
                          <button 
                            onClick={() => handleCancelOrder(orderId)}
                            className="bg-white text-rose-500 border border-rose-200 hover:bg-rose-50 px-3 py-1 rounded text-[10px] font-bold"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;