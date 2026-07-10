import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, PageHeader, Spinner, StatCard } from '../../components/ui';

export default function TenantWaterBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/water/bills').then(r => setBills(r.data.bills)).finally(() => setLoading(false));
  }, []);

  const unpaidTotal = bills.filter(b => !b.is_paid).reduce((s, b) => s + Number(b.total_amount), 0);
  const paidCount = bills.filter(b => b.is_paid).length;

  const columns = [
    { key: 'house_number', label: 'House' },
    { key: 'month', label: 'Month' },
    {
      key: 'reading',
      label: 'Reading (prev → curr)',
      render: r => `${Number(r.previous_reading).toFixed(1)} → ${Number(r.current_reading).toFixed(1)}`
    },
    { key: 'units_used', label: 'Units Used', render: r => Number(r.units_used).toFixed(1) },
    { key: 'rate_per_unit', label: 'Rate/Unit (KES)', render: r => Number(r.rate_per_unit).toLocaleString() },
    {
      key: 'total_amount',
      label: 'Amount (KES)',
      render: r => <span className="font-semibold">{Number(r.total_amount).toLocaleString()}</span>
    },
    {
      key: 'is_paid',
      label: 'Status',
      render: r => r.is_paid
        ? <span className="badge-success">Paid {r.paid_at ? `(${new Date(r.paid_at).toLocaleDateString()})` : ''}</span>
        : <span className="badge-danger">Unpaid</span>
    },
  ];

  return (
    <div>
      <PageHeader title="Water Bills" subtitle="Your monthly water billing history" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Bills" value={bills.length} icon="📋" color="primary" />
        <StatCard label="Paid Bills" value={paidCount} icon="✅" color="green" />
        <StatCard label="Outstanding Amount" value={`KES ${unpaidTotal.toLocaleString()}`} icon="💧" color="red" />
      </div>

      {loading ? <Spinner /> : (
        <Table columns={columns} data={bills} emptyMessage="No water bills found for your unit." />
      )}
    </div>
  );
}
