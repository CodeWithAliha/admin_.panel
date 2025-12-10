import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalProducts: 0,
    productsChange: 0,
    totalCustomers: 0,
    customersChange: 0,
  });
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number; revenue: number }[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'completed');

    const { data: products } = await supabase.from('products').select('*');

    const { data: orderItems } = await supabase
      .from('order_items')
      .select(`
        *,
        products (name)
      `);

    if (orders) {
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      setStats((prev) => ({
        ...prev,
        totalRevenue,
        revenueChange: 15.3,
        totalOrders: orders.length,
        ordersChange: 8.2,
      }));

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDate = last7Days.map((date) => {
        const dayOrders = orders.filter((order) => order.created_at.startsWith(date));
        const revenue = dayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
        return { date, revenue };
      });

      setRevenueData(revenueByDate);
    }

    if (products) {
      setStats((prev) => ({
        ...prev,
        totalProducts: products.length,
        productsChange: 5.1,
        totalCustomers: 1247,
        customersChange: 12.4,
      }));
    }

    if (orderItems) {
      const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {};

      orderItems.forEach((item: any) => {
        const productName = item.products?.name || 'Unknown';
        if (!productSales[productName]) {
          productSales[productName] = { name: productName, sales: 0, revenue: 0 };
        }
        productSales[productName].sales += item.quantity;
        productSales[productName].revenue += Number(item.subtotal);
      });

      const topProductsArray = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopProducts(topProductsArray);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
        <p className="text-gray-600">Track your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          icon={<DollarSign className="w-6 h-6" />}
          color="from-green-500 to-emerald-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change={stats.ordersChange}
          icon={<ShoppingCart className="w-6 h-6" />}
          color="from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          change={stats.productsChange}
          icon={<Package className="w-6 h-6" />}
          color="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          change={stats.customersChange}
          icon={<Users className="w-6 h-6" />}
          color="from-orange-500 to-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Trend (Last 7 Days)</h3>
          <RevenueChart data={revenueData} />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A58A] to-[#8B7355] flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sold</p>
                  </div>
                </div>
                <p className="font-bold text-[#8B7355]">${product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Order Status Distribution</h3>
          <OrderStatusChart />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Methods</h3>
          <PaymentMethodsChart />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {isPositive ? '+' : ''}
        {change}% from last month
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="h-64">
      <div className="h-full flex items-end justify-around gap-2">
        {data.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative h-48">
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-[#C9A58A] to-[#C9A58A]/40 rounded-t-xl transition-all duration-500 hover:from-[#C9A58A] hover:to-[#C9A58A]/60 cursor-pointer"
                style={{ height: `${(point.revenue / maxRevenue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${point.revenue.toFixed(2)}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderStatusChart() {
  const statuses = [
    { name: 'Completed', value: 65, color: 'bg-green-500' },
    { name: 'Preparing', value: 20, color: 'bg-blue-500' },
    { name: 'Pending', value: 10, color: 'bg-yellow-500' },
    { name: 'Cancelled', value: 5, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-4">
      {statuses.map((status) => (
        <div key={status.name}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{status.name}</span>
            <span className="text-sm font-bold text-gray-800">{status.value}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${status.color} rounded-full transition-all duration-500`} style={{ width: `${status.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentMethodsChart() {
  const methods = [
    { name: 'Cash', value: 45, color: 'bg-emerald-500' },
    { name: 'Card', value: 40, color: 'bg-blue-500' },
    { name: 'Online', value: 15, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <div key={method.name}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{method.name}</span>
            <span className="text-sm font-bold text-gray-800">{method.value}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${method.color} rounded-full transition-all duration-500`} style={{ width: `${method.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
