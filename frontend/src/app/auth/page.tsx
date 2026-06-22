'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Flame, Eye, EyeOff, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await api.login(form.email, form.password);
      } else {
        result = await api.register({ email: form.email, password: form.password, name: form.name });
      }
      api.setToken(result.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-steel-900 via-steel-800 to-steel-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(234,88,12,0.1) 40px, rgba(234,88,12,0.1) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(234,88,12,0.1) 40px, rgba(234,88,12,0.1) 41px)`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/30">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">WeldTrack</h1>
              <p className="text-steel-400 text-sm">Kaynak Atölyesi Yönetimi</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Atölyenizi<br />
            <span className="text-brand-400">Dijital Olarak</span><br />
            Yönetin
          </h2>

          <p className="text-steel-300 text-lg leading-relaxed max-w-md">
            İş emirleri, malzeme envanteri, usta yönetimi ve faturalama — 
            hepsi tek bir platformda. Kaynak atölyeniz için tasarlanmış 
            profesyonel yönetim sistemi.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            {[
              { label: 'İş Emri Takibi', value: 'Anlık Durum' },
              { label: 'Malzeme Stoku', value: 'Otomatik Uyarı' },
              { label: 'Usta Yönetimi', value: 'Sertifika Kayıt' },
              { label: 'Faturalama', value: 'KDV Hesaplama' },
            ].map((item) => (
              <div key={item.label} className="bg-steel-800/50 rounded-lg p-4 border border-steel-700/50">
                <p className="text-brand-400 text-xs font-mono uppercase tracking-wider">{item.value}</p>
                <p className="text-white font-medium mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-steel-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">WeldTrack</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
          </h2>
          <p className="text-steel-400 mb-8">
            {isLogin ? 'Hesabınıza giriş yaparak devam edin' : 'Yeni bir hesap oluşturun'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-2">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-steel-900 border border-steel-700 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Ahmet Demir"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-steel-300 mb-2">E-posta</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-steel-900 border border-steel-700 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="demo@kaynakatolyesi.com.tr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-300 mb-2">Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-steel-900 border border-steel-700 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-400 hover:text-steel-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-steel-400 text-sm">
            {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </p>

          {isLogin && (
            <div className="mt-8 p-4 bg-steel-900/50 border border-steel-800 rounded-lg">
              <p className="text-xs text-steel-500 font-mono uppercase tracking-wider mb-2">Demo Hesap</p>
              <p className="text-steel-300 text-sm">demo@kaynakatolyesi.com.tr</p>
              <p className="text-steel-300 text-sm">demo123456</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
