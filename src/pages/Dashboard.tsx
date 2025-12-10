import { useEffect, useState } from 'react';
import { ShoppingBag, Users, DollarSign, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalOrders: number;
  ordersChange: number;
  newCustomers: number;
  customersChange: number;
  totalSales: number;
  salesChange: number;
}

interface TrendingProduct {
  id: string;
  name: string;
  price: number;
  sales: number;
  image_url: string | null;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string | null;
  created_at: string;
  table_number: string | null;
  total_amount: number;
  payment_method: string | null;
  items: { product_name: string }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    ordersChange: 0,
    newCustomers: 0,
    customersChange: 0,
    totalSales: 0,
    salesChange: 0,
  });
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', lastMonth.toISOString());

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .limit(5);

    const { data: recentOrdersData } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          products (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (orders) {
      const totalOrders = orders.length;
      const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

      setStats({
        totalOrders,
        ordersChange: -2.33,
        newCustomers: 1012,
        customersChange: 32.4,
        totalSales,
        salesChange: 25,
      });
    }

    if (products) {
      setTrendingProducts(
        products.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          sales: Math.floor(Math.random() * 300) + 100,
          image_url: product.image_url,
        }))
      );
    }

    if (recentOrdersData) {
      setRecentOrders(
        recentOrdersData.map((order: any) => ({
          id: order.id,
          order_number: order.order_number,
          customer_name: order.customer_name,
          created_at: order.created_at,
          table_number: order.table_number,
          total_amount: order.total_amount,
          payment_method: order.payment_method,
          items: order.order_items.map((item: any) => ({
            product_name: item.products.name,
          })),
        }))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Order"
          value={stats.totalOrders.toLocaleString()}
          change={stats.ordersChange}
          icon={<ShoppingBag className="w-6 h-6 text-[#8B7355]" />}
        />
        <StatCard
          title="New Customer"
          value={stats.newCustomers.toLocaleString()}
          change={stats.customersChange}
          icon={<Users className="w-6 h-6 text-[#8B7355]" />}
        />
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          change={stats.salesChange}
          icon={<DollarSign className="w-6 h-6 text-[#8B7355]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Sales Analytics</h2>
            <button className="text-sm text-[#8B7355] font-medium hover:underline">See all</button>
          </div>
          <SalesChart />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Trending Coffee</h2>
            <button className="text-sm text-[#8B7355] font-medium hover:underline">See all</button>
          </div>
          <div className="space-y-4">
            {trendingProducts.map((product) => (
              <TrendingItem
                key={product.id}
                name={product.name}
                price={product.price}
                sales={product.sales}
                image={product.image_url}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Order</h2>
          <button className="text-sm text-[#8B7355] font-medium hover:underline">See all</button>
        </div>
        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: number; icon: React.ReactNode }) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#E8D5C4] rounded-2xl">{icon}</div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isPositive ? '+' : ''}
          {change}%
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C9A58A] to-[#8B7355] rounded-full transition-all duration-500"
          style={{ width: `${Math.min(Math.abs(change) * 2, 100)}%` }}
        />
      </div>
    </div>
  );
}

function SalesChart() {
  const data = [
    { time: '09:00 AM', value: 50 },
    { time: '12:00 PM', value: 150 },
    { time: '04:00 PM', value: 230 },
    { time: '08:00 PM', value: 180 },
    { time: '12:00 PM', value: 120 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="h-64 relative">
      <div className="absolute inset-0 flex items-end justify-around gap-8 pb-8">
        {data.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-4">
            <div className="w-full relative" style={{ height: '200px' }}>
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-[#C9A58A]/40 to-[#C9A58A]/10 rounded-t-2xl transition-all duration-500 hover:from-[#C9A58A]/60 hover:to-[#C9A58A]/20 cursor-pointer"
                style={{ height: `${(point.value / maxValue) * 100}%` }}
              >
                {index === 2 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#C9A58A] text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    {point.value}
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">{point.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingItem({ name, price, sales, image }: { name: string; price: number; sales: number; image: string | null }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-[#E8D5C4] flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <ShoppingBag className="w-6 h-6 text-[#8B7355]" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-600">${price.toFixed(2)}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-800">{sales}</p>
      </div>
    </div>
  );
}

function OrdersTable({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
              <input type="checkbox" className="w-4 h-4 rounded" />
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">#</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Items</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Date & Time</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Table Number</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Price</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Payment</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4">
                <input type="checkbox" className="w-4 h-4 rounded" />
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">{index + 1}</td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8D5C4] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[#8B7355]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {order.items[0]?.product_name || 'Product'}
                    </p>
                    <p className="text-xs text-gray-500">#{order.order_number}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {new Date(order.created_at).toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">{order.table_number || 'N/A'}</td>
              <td className="py-4 px-4 text-sm font-semibold text-gray-800">
                ${order.total_amount.toFixed(0)}
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600 capitalize">{order.payment_method || 'N/A'}</span>
              </td>
              <td className="py-4 px-4">
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
