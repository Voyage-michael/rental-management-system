import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, Spinner, PageHeader, Table } from '../../components/ui';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rent/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const paymentColumns = [
    { key: 'tenant_name', label: 'Tenant' },
    { key: 'house_number', label: 'House' },
    { key: 'amount_paid', label: 'Amount (KES)', render: r => Number(r.amount_paid).toLocaleString() },
    { key: 'month', label: 'Month' },
    { key: 'payment_date', label: 'Date', render: r => new Date(r.payment_date).toLocaleDateString() },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your property overview at a glance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Houses" value={stats?.totalHouses ?? 0} icon="🏠" color="primary" />
        <StatCard label="Occupied" value={stats?.occupiedHouses ?? 0} icon="✅" color="green" sub={`${stats?.vacantHouses ?? 0} vacant`} />
        <StatCard label="Active Tenants" value={stats?.activeTenants ?? 0} icon="👥" color="teal" />
        <StatCard label="Pending Maintenance" value={stats?.pendingMaintenance ?? 0} icon="🔧" color="yellow" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Total Revenue Collected"
          value={`KES ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon="💰"
          color="green"
        />
        <StatCard label="Unpaid Water Bills" value={stats?.unpaidWaterBills ?? 0} icon="💧" color="red" />
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-gray-900 mb-4">Recent Rent Payments</h2>
        <Table
          columns={paymentColumns}
          data={stats?.recentPayments ?? []}
          emptyMessage="No payments recorded yet."
        />
      </div>
    </div>
  );
}
