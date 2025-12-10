import { Home, ShoppingBag, ClipboardList, Heart, CreditCard, Settings, LogOut, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { signOut, profile } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'favorites', label: 'Favorite', icon: Heart },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-[#C9A58A] to-[#B89A7E] h-screen fixed left-0 top-0 flex flex-col shadow-xl">
      <div className="p-6 flex items-center justify-center border-b border-white/20">
        <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center">
          <span className="text-3xl font-bold text-white">N</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                isActive
                  ? 'bg-white/90 text-[#8B7355] shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 transform hover:scale-[1.02]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
