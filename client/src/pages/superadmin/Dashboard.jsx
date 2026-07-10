import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, Spinner, PageHeader } from '../../components/ui';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/super-admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="System Overview" subtitle="Platform-wide statistics and health" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Landlords" value={stats?.totalAdmins ?? 0} icon="👔" color="purple" />
        <StatCard label="Total Tenants" value={stats?.totalTenants ?? 0} icon="👥" color="teal" />
        <StatCard label="Total Houses" value={stats?.totalHouses ?? 0} icon="🏠" color="primary" />
        <StatCard label="Pending Maintenance" value={stats?.pendingMaintenance ?? 0} icon="🔧" color="yellow" />
        <StatCard
          label="Total Revenue Collected"
          value={`KES ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon="💰"
          color="green"
        />
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Landlord', href: '/superadmin/admins', icon: '➕' },
            { label: 'View All Tenants', href: '/superadmin/tenants', icon: '👥' },
            { label: 'View All Houses', href: '/superadmin/houses', icon: '🏠' },
            { label: 'Manage Admins', href: '/superadmin/admins', icon: '⚙️' },
          ].map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 hover:text-primary-700 transition-colors text-center"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
