'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Settings, User, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(console.error).finally(() => setLoading(false));
  }, []);

  const roleLabels: Record<string, string> = {
    ADMIN: 'Yönetici',
    OPERATOR: 'Operatör',
    VIEWER: 'Görüntüleyici',
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Settings className="w-7 h-7 text-brand-500" />Ayarlar</h1>
        <p className="text-steel-400 mt-1">Hesap ve uygulama ayarları</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><User className="w-5 h-5 text-brand-400" />Profil Bilgileri</h3>
          {profile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-steel-400 mb-1">Ad Soyad</label>
                <p className="text-white font-medium">{profile.name}</p>
              </div>
              <div>
                <label className="block text-sm text-steel-400 mb-1">E-posta</label>
                <p className="text-white">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm text-steel-400 mb-1">Rol</label>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-400" />
                  <span className="text-white">{roleLabels[profile.role] || profile.role}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-steel-500">Profil bilgisi yüklenemedi</p>
          )}
        </div>

        <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Uygulama Hakkında</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-steel-400">Uygulama</span><span className="text-white">WeldTrack</span></div>
            <div className="flex justify-between"><span className="text-steel-400">Sürüm</span><span className="text-steel-300 font-mono">1.0.0</span></div>
            <div className="flex justify-between"><span className="text-steel-400">Açıklama</span><span className="text-steel-300">Kaynak Atölyesi Yönetim Platformu</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
