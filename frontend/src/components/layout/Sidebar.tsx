'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import {
  Flame, LayoutDashboard, ClipboardList, Users, Wrench,
  Package, FileText, Settings, LogOut, ChevronLeft,
  ChevronRight, Menu, X, HardHat,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Kontrol Paneli' },
  { href: '/work-orders', icon: ClipboardList, label: 'İş Emirleri' },
  { href: '/customers', icon: Users, label: 'Müşteriler' },
  { href: '/workers', icon: HardHat, label: 'Ustalar' },
  { href: '/materials', icon: Package, label: 'Malzemeler' },
  { href: '/invoices', icon: FileText, label: 'Faturalar' },
  { href: '/settings', icon: Settings, label: 'Ayarlar' },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    api.setToken(null);
    router.push('/auth');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-steel-800', collapsed && 'justify-center px-2')}>
        <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Flame className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-white tracking-tight truncate">WeldTrack</h1>
            <p className="text-[10px] text-steel-500 font-mono uppercase tracking-widest">Atölye Yönetimi</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-brand-600/15 text-brand-400 border border-brand-600/30'
                  : 'text-steel-400 hover:text-white hover:bg-steel-800/60 border border-transparent',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-brand-400' : 'text-steel-500 group-hover:text-steel-300')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-steel-800 p-2">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-steel-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full',
            collapsed && 'justify-center px-2',
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Çıkış Yap</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-steel-950">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col bg-steel-900 border-r border-steel-800 transition-all duration-300 relative',
        collapsed ? 'w-16' : 'w-64',
      )}>
        <NavContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-steel-800 border border-steel-700 rounded-full flex items-center justify-center text-steel-400 hover:text-white hover:bg-steel-700 transition-all z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-steel-800 border border-steel-700 rounded-lg flex items-center justify-center text-steel-300"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-steel-900 border-r border-steel-800 z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-steel-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
