import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const navConfig = {
  super_admin: [
    { to: '/superadmin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/superadmin/admins', label: 'Manage Admins', icon: '👥' },
    { to: '/superadmin/tenants', label: 'All Tenants', icon: '🏘️' },
    { to: '/superadmin/houses', label: 'All Houses', icon: '🏠' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/houses', label: 'Houses', icon: '🏠' },
    { to: '/admin/tenants', label: 'Tenants', icon: '👥' },
    { to: '/admin/rent', label: 'Rent Payments', icon: '💰' },
    { to: '/admin/water', label: 'Water Billing', icon: '💧' },
    { to: '/admin/maintenance', label: 'Maintenance', icon: '🔧' },
  ],
  tenant: [
    { to: '/tenant/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/tenant/maintenance', label: 'Maintenance', icon: '🔧' },
    { to: '/tenant/water-bills', label: 'Water Bills', icon: '💧' },
    { to: '/tenant/rent-history', label: 'Rent History', icon: '💰' },
  ],
};

const roleLabel = {
  super_admin: { title: 'System Admin', color: 'from-purple-600 to-purple-700', badge: 'Super Admin' },
  admin: { title: 'Property Manager', color: 'from-primary-600 to-primary-700', badge: 'Admin' },
  tenant: { title: 'Tenant Portal', color: 'from-teal-600 to-teal-700', badge: 'Tenant' },
};

export default function AdminLayout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = navConfig[role] || [];
  const config = roleLabel[role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`bg-gradient-to-br ${config.color} px-6 py-5`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <p className="text-white font-extrabold text-base leading-tight">RentFlow</p>
            <p className="text-white/70 text-xs">{config.title}</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <span className="text-xs text-gray-500">{config.badge}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <span className="text-base">🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 h-full bg-white shadow-xl">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user?.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
