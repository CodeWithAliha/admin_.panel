import { useEffect, useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const [settings, setSettings] = useState({
    app_name: 'Coffee Dashboard',
    logo_url: '',
    currency: '$',
    timezone: 'UTC',
    primary_color: '#C9A58A',
    secondary_color: '#8B7355',
    accent_color: '#D4B5A0',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*');

    if (data) {
      const settingsObj: any = {};
      data.forEach((setting) => {
        if (setting.key === 'theme' && typeof setting.value === 'object') {
          settingsObj.primary_color = setting.value.primary || '#C9A58A';
          settingsObj.secondary_color = setting.value.secondary || '#8B7355';
          settingsObj.accent_color = setting.value.accent || '#D4B5A0';
        } else {
          settingsObj[setting.key] = typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value).replace(/"/g, '');
        }
      });
      setSettings({ ...settings, ...settingsObj });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    const updates = [
      { key: 'app_name', value: settings.app_name },
      { key: 'logo_url', value: settings.logo_url },
      { key: 'currency', value: settings.currency },
      { key: 'timezone', value: settings.timezone },
      {
        key: 'theme',
        value: {
          primary: settings.primary_color,
          secondary: settings.secondary_color,
          accent: settings.accent_color,
        },
      },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: update.key, value: update.value }, { onConflict: 'key' });

      if (error) {
        alert('Error saving settings: ' + error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600">Customize your coffee dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
              <input
                type="text"
                value={settings.app_name}
                onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                type="url"
                value={settings.logo_url}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Theme Colors</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-16 h-12 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.secondary_color}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  className="w-16 h-12 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondary_color}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.accent_color}
                  onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                  className="w-16 h-12 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accent_color}
                  onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A58A] focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-3">Color Preview</p>
              <div className="flex gap-3">
                <div
                  className="flex-1 h-16 rounded-xl shadow-md"
                  style={{ backgroundColor: settings.primary_color }}
                />
                <div
                  className="flex-1 h-16 rounded-xl shadow-md"
                  style={{ backgroundColor: settings.secondary_color }}
                />
                <div
                  className="flex-1 h-16 rounded-xl shadow-md"
                  style={{ backgroundColor: settings.accent_color }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {saved && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-xl font-semibold">
            Settings saved successfully!
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-[#C9A58A] to-[#8B7355] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
