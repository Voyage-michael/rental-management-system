import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, Modal, PageHeader, Alert, Spinner } from '../../components/ui';

export default function RentPayments() {
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    tenant_id: '',
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    reference_number: '',
    notes: '',
    month: new Date().toISOString().slice(0, 7),
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [paymentsRes, tenantsRes] = await Promise.all([
        api.get('/rent'),
        api.get('/tenants'),
      ]);
      setPayments(paymentsRes.data.payments);
      setTenants(tenantsRes.data.tenants);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/rent', form);
      const balance = res.data.balance;
      setAlert({
        type: balance > 0 ? 'warning' : 'success',
        message: `Payment recorded. ${balance > 0 ? `Outstanding balance: KES ${Number(balance).toLocaleString()}` : 'Fully paid.'}`,
      });
      setShowModal(false);
      resetForm();
      fetchAll();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to record payment.' });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => setForm({
    tenant_id: '',
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    reference_number: '',
    notes: '',
    month: new Date().toISOString().slice(0, 7),
  });

  const filtered = payments.filter(p =>
    p.tenant_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.house_number?.toLowerCase().includes(search.toLowerCase()) ||
    p.month?.includes(search)
  );

  const selectedTenant = tenants.find(t => String(t.id) === String(form.tenant_id));

  const columns = [
    { key: 'tenant_name', label: 'Tenant' },
    { key: 'house_number', label: 'House' },
    { key: 'month', label: 'Month' },
    { key: 'amount_paid', label: 'Paid (KES)', render: r => Number(r.amount_paid).toLocaleString() },
    { key: 'expected_amount', label: 'Expected (KES)', render: r => Number(r.expected_amount).toLocaleString() },
    {
      key: 'balance', label: 'Balance (KES)',
      render: r => (
        <span className={Number(r.balance) > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
          {Number(r.balance) > 0 ? `-${Number(r.balance).toLocaleString()}` : 'Paid'}
        </span>
      )
    },
    { key: 'payment_method', label: 'Method', render: r => r.payment_method?.replace('_', ' ') },
    { key: 'reference_number', label: 'Ref No.' },
    { key: 'payment_date', label: 'Date', render: r => new Date(r.payment_date).toLocaleDateString() },
  ];

  return (
    <div>
      <PageHeader
        title="Rent Payments"
        subtitle="Record and track tenant rent payments"
        action={<button className="btn-primary" onClick={() => setShowModal(true)}>+ Record Payment</button>}
      />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="mb-4">
        <input
          className="input-field max-w-sm"
          placeholder="Search tenant, house, month..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? <Spinner /> : <Table columns={columns} data={filtered} emptyMessage="No payments recorded yet." />}

      <Modal open={showModal} onClose={() => { setShowModal(false); resetForm(); }} title="Record Rent Payment" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant *</label>
              <select className="input-field" value={form.tenant_id} onChange={e => setForm({ ...form, tenant_id: e.target.value })} required>
                <option value="">Select tenant...</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name} — House {t.house_number}</option>
                ))}
              </select>
              {selectedTenant && (
                <p className="text-xs text-gray-500 mt-1">
                  Expected rent: <strong>KES {Number(selectedTenant.rent_amount).toLocaleString()}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (KES) *</label>
              <input type="number" className="input-field" value={form.amount_paid} onChange={e => setForm({ ...form, amount_paid: e.target.value })} required min="1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
              <input type="month" className="input-field" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
              <input type="date" className="input-field" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select className="input-field" value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input className="input-field" placeholder="e.g. M-Pesa transaction ID" value={form.reference_number} onChange={e => setForm({ ...form, reference_number: e.target.value })} />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className="input-field" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Record Payment'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
