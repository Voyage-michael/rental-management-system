import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, PageHeader, Spinner, StatCard } from '../../components/ui';

export default function TenantRentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rent').then(r => setPayments(r.data.payments)).finally(() => setLoading(false));
  }, []);

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount_paid), 0);
  const totalBalance = payments.reduce((s, p) => s + Number(p.balance), 0);
  const lastPayment = payments[0];

  const columns = [
    { key: 'month', label: 'Month' },
    { key: 'amount_paid', label: 'Paid (KES)', render: r => Number(r.amount_paid).toLocaleString() },
    { key: 'expected_amount', label: 'Expected (KES)', render: r => Number(r.expected_amount).toLocaleString() },
    {
      key: 'balance', label: 'Balance',
      render: r => (
        <span className={Number(r.balance) > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
          {Number(r.balance) > 0 ? `-KES ${Number(r.balance).toLocaleString()}` : '✓ Cleared'}
        </span>
      )
    },
    {
      key: 'payment_method', label: 'Method',
      render: r => (
        <span className="capitalize">{r.payment_method?.replace('_', ' ')}</span>
      )
    },
    { key: 'reference_number', label: 'Ref No.', render: r => r.reference_number || '—' },
    { key: 'payment_date', label: 'Date', render: r => new Date(r.payment_date).toLocaleDateString() },
  ];

  return (
    <div>
      <PageHeader title="Rent History" subtitle="Your complete rent payment record" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Paid" value={`KES ${totalPaid.toLocaleString()}`} icon="💰" color="green" />
        <StatCard
          label="Last Payment"
          value={lastPayment ? `KES ${Number(lastPayment.amount_paid).toLocaleString()}` : '—'}
          icon="📅"
          color="primary"
          sub={lastPayment?.month}
        />
        <StatCard
          label="Outstanding Balance"
          value={totalBalance > 0 ? `KES ${totalBalance.toLocaleString()}` : 'None'}
          icon="📊"
          color={totalBalance > 0 ? 'red' : 'green'}
        />
      </div>

      {loading ? <Spinner /> : (
        <Table columns={columns} data={payments} emptyMessage="No rent payments found." />
      )}
    </div>
  );
}
