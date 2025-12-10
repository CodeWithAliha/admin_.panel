import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      alert('Error deleting user: ' + error.message);
      return;
    }

    fetchUsers();
  };

  const openModal = (user?: Profile) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'manager':
        return 'bg-blue-100 text-blue-700';
      case 'staff':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
          <p className="text-gray-600">Manage admin and staff accounts</p>
        </div>
        {profile?.role === 'admin' && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-[#C9A58A] to-[#8B7355] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform transition-all hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A58A] to-[#8B7355] flex items-center justify-center text-white text-2xl font-bold mb-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.full_name.charAt(0)
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{user.full_name}</h3>
              <p className="text-sm text-gray-600 mb-3">{user.email}</p>
              <span className={`px-4 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                {user.role.toUpperCase()}
              </span>
            </div>

            <div className="text-center text-sm text-gray-600 mb-4">
              <p>Joined {new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            {profile?.role === 'admin' && (
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(user)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                {user.id !== profile.id && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={closeModal}
          onSave={() => {
            fetchUsers();
            closeModal();
          }}
        />
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSave }: { user: Profile | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    full_name: user?.full_name || '',
    role: user?.role || 'staff',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          role: formData.role as 'admin' | 'staff' | 'manager',
        })
        .eq('id', user.id);

      if (error) {
        alert('Error updating user: ' + error.message);
        setLoading(false);
        return;
      }
    } else {
      if (!formData.password || formData.password.length < 6) {
        alert('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const { error } = await signUp(formData.email, formData.password, formData.full_name, formData.role);

      if (error) {
        alert('Error creating user: ' + error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{user ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!user}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none disabled:bg-gray-100"
              placeholder="john@example.com"
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!user}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
                placeholder="Minimum 6 characters"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
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
              {loading ? 'Saving...' : user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
