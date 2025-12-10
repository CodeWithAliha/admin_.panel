import { useEffect, useState } from 'react';
import { Plus, MoreVertical, X, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Database } from '../lib/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface OrderWithItems extends Order {
  order_items: {
    id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    products: Product;
  }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          subtotal,
          products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    setOrders(data as any || []);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      alert('Error updating order status: ' + error.message);
      return;
    }

    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'preparing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#C9A58A] to-[#8B7355] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          New Order
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">#</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Order Number</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Items</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Table</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Total</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Payment</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-600">{index + 1}</td>
                <td className="py-4 px-4 text-sm font-medium text-gray-800">#{order.order_number}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{order.customer_name || 'Guest'}</td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {order.order_items?.length || 0} items
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{order.table_number || 'N/A'}</td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-800">
                  ${Number(order.total_amount).toFixed(2)}
                </td>
                <td className="py-4 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600 capitalize">{order.payment_method || 'N/A'}</span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <NewOrderModal
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            fetchOrders();
            setIsModalOpen(false);
          }}
        />
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

function NewOrderModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    setProducts(data || []);
  };

  const addProduct = (product: Product) => {
    const existing = selectedProducts.find((p) => p.product.id === product.id);
    if (existing) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setSelectedProducts(selectedProducts.filter((p) => p.product.id !== productId));
    } else {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.product.id === productId ? { ...p, quantity } : p
        )
      );
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert('Please add at least one product');
      return;
    }

    setLoading(true);

    const orderNumber = `ORD${Date.now()}`;
    const totalAmount = calculateTotal();

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerName || null,
        table_number: tableNumber || null,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        created_by: profile?.id,
      })
      .select()
      .single();

    if (orderError) {
      alert('Error creating order: ' + orderError.message);
      setLoading(false);
      return;
    }

    const orderItems = selectedProducts.map((item) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: Number(item.product.price),
      subtotal: Number(item.product.price) * item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      alert('Error adding order items: ' + itemsError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Table Number</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
                placeholder="e.g., 2B"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Products</label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addProduct(product)}
                  className="p-3 border border-gray-300 rounded-xl hover:border-[#C9A58A] hover:bg-[#E8D5C4]/20 transition-all text-left"
                >
                  <p className="font-semibold text-sm text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-600">${Number(product.price).toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="border border-gray-300 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedProducts.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.product.name}</p>
                      <p className="text-sm text-gray-600">${Number(item.product.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                      <span className="w-20 text-right font-semibold">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">Total</span>
                <span className="font-bold text-2xl text-[#8B7355]">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#C9A58A] to-[#8B7355] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderDetailsModal({ order, onClose }: { order: OrderWithItems; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-semibold text-gray-800">#{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-semibold text-gray-800">{order.customer_name || 'Guest'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Table Number</p>
              <p className="font-semibold text-gray-800">{order.table_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-semibold text-gray-800 capitalize">{order.payment_method || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{item.products.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">${Number(item.subtotal).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-gray-800">Total</span>
              <span className="font-bold text-2xl text-[#8B7355]">
                ${Number(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
