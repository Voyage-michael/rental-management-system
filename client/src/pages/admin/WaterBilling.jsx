import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, Modal, PageHeader, Alert, Spinner } from '../../components/ui';

const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

const emptyForm = { house_id: '', previous_reading: '', current_reading: '', month: currentMonth, rate_per_unit: '50' };

export default function WaterBilling() {
  const [bills, setBills] = useState([]);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('bills');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/water/bills'),
      api.get('/houses'),
    ]).then(([bRes, hRes]) => {
      setBills(bRes.data.bills);
      setHouses(hRes.data.houses.filter(h => h.status === 'occupied'));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-fill previous reading when house selected
  const handleHouseChange = async (houseId) => {
    setForm(f => ({ ...f, house_id: houseId, previous_reading: '' }));
    if (!houseId) return;
    try {
      const res = await api.get('/water/readings');
      const readings = res.data.readings.filter(r => r.house_id == houseId);
      if (readings.length > 0) {
        setForm(f => ({ ...f, house_id: houseId, previous_reading: readings[0].current_reading }));
      }
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/water/readings', form);
      setAlert({ type: 'success', message: `Reading recorded! Bill: KES ${Number(res.data.bill.total_amount).toLocaleString()} (${res.data.bill.units_used} units)` });
      setModal(false);
      setForm(emptyForm);
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to record reading.' });
    } finally { setSaving(false); }
  };

  const handleMarkPaid = async (id) => {
    try {
      await api.patch(`/water/bills/${id}/pay`);
      setAlert({ type: 'success', message: 'Bill marked as paid.' });
      fetchData();
    } catch {
      setAlert({ type: 'error', message: 'Failed to update bill.' });
    }
  };

  const preview = form.current_reading && form.previous_reading
    ? ((parseFloat(form.current_reading) - parseFloat(form.previous_reading)) * parseFloat(form.rate_per_unit || 50)).toFixed(2)
    : null;

  const billColumns = [
    { key: 'house_number', label: 'House' },
    { key: 'month', label: 'Month' },
    { key: 'previous_reading', label: 'Prev. Reading', render: r => `${r.previous_reading} m³` },
    { key: 'current_reading', label: 'Curr. Reading', render: r => `${r.current_reading} m³` },
    { key: 'units_used', label: 'Units Used', render: r => `${r.units_used} m³` },
    { key: 'rate_per_unit', label: 'Rate (KES)', render: r => Number(r.rate_per_unit).toLocaleString() },
    { key: 'total_amount', label: 'Total (KES)', render: r => <span className="font-semibold">{Number(r.total_amount).toLocaleString()}</span> },
    {
      key: 'is_paid', label: 'Status',
      render: r => r.is_paid
        ? <span className="badge-success">Paid</span>
        : <button onClick={() => handleMarkPaid(r.bill_id || r.id)} className="text-xs font-semibold px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">Mark Paid</button>
    },
  ];

  return (
    <div>
      <PageHeader
        title="Water Billing"
        subtitle="Record readings and generate bills automatically"
        action={<button className="btn-primary" onClick={() => setModal(true)}>+ Enter Reading</button>}
      />
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {loading ? <Spinner /> : <Table columns={billColumns} data={bills} emptyMessage="No water bills yet. Enter a reading to get started." />}

      {/* Add Reading Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Enter Water Reading" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">House *</label>
            <select className="input-field" value={form.house_id} onChange={e => handleHouseChange(e.target.value)} required>
              <option value="">-- Select House --</option>
              {houses.map(h => <option key={h.id} value={h.id}>{h.house_number}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
            <input type="month" className="input-field" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Reading (m³)</label>
              <input type="number" className="input-field" value={form.previous_reading} onChange={e => setForm({ ...form, previous_reading: e.target.value })} min="0" step="0.01" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Reading (m³) *</label>
              <input type="number" className="input-field" value={form.current_reading} onChange={e => setForm({ ...form, current_reading: e.target.value })} required min="0" step="0.01" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate per Unit (KES) *</label>
            <input type="number" className="input-field" value={form.rate_per_unit} onChange={e => setForm({ ...form, rate_per_unit: e.target.value })} required min="0" step="0.01" />
          </div>
          {preview !== null && parseFloat(form.current_reading) >= parseFloat(form.previous_reading || 0) && (
            <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-sm text-primary-700">
                <span className="font-semibold">Preview:</span>{' '}
                {(parseFloat(form.current_reading) - parseFloat(form.previous_reading || 0)).toFixed(2)} m³ × KES {form.rate_per_unit} ={' '}
                <span className="font-bold">KES {Number(preview).toLocaleString()}</span>
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Record & Generate Bill'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
