import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { profile } = useAuth();

  return (
    <div className="bg-gradient-to-r from-[#E8D5C4] to-[#D4B5A0] rounded-3xl p-6 mb-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search something"
              className="w-80 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none text-gray-700 placeholder-gray-400"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <button className="relative p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A58A] to-[#8B7355] flex items-center justify-center text-white font-semibold">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {profile?.role === 'admin' ? 'Admin' : profile?.role === 'manager' ? 'Manager' : 'Staff'}
              </p>
              <p className="text-xs text-gray-600">{profile?.full_name || 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
