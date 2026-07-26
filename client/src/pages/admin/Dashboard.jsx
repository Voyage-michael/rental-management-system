import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import api from '../../api/axios';
import { StatCard, Spinner, PageHeader, Table } from '../../components/ui';

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

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
      <PageHeader
  title={`${getGreeting()} 👋`}
  subtitle="Manage your properties, tenants, rent payments and maintenance from one place."

action={
  <div className="flex gap-3">
    <Link
      to="/admin/houses"
      className="btn-secondary"
    >
      + Add Property
    </Link>

    <Link
      to="/admin/tenants"
      className="btn-primary"
    >
      + Add Tenant
    </Link>
  </div>
}
/>

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
