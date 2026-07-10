import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, Modal, PageHeader, Alert, Spinner, StatusBadge } from '../../components/ui';

const emptyForm = { house_number: '', description: '', rent_amount: '', status: 'vacant' };

export default function Houses() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | house object (edit)
  const [form, setForm] = useState(emptyForm);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = () => {
    setLoading(true);
    api.get('/houses').then(r => setHouses(r.data.houses)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(emptyForm); setModal('create'); };
  const openEdit = (h) => {
    setForm({ house_number: h.house_number, description: h.description || '', rent_amount: h.rent_amount, status: h.status });
    setModal(h);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/houses', form);
        setAlert({ type: 'success', message: 'House created successfully.' });
      } else {
        await api.put(`/houses/${modal.id}`, form);
        setAlert({ type: 'success', message: 'House updated successfully.' });
      }
      setModal(null);
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this house? This cannot be undone.')) return;
    try {
      await api.delete(`/houses/${id}`);
      setAlert({ type: 'success', message: 'House deleted.' });
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Delete failed.' });
    }
  };

  const filtered = houses.filter(h =>
    h.house_number?.toLowerCase().includes(search.toLowerCase()) ||
    h.description?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'house_number', label: 'House No.' },
    { key: 'description', label: 'Description' },
    { key: 'rent_amount', label: 'Rent (KES)', render: r => Number(r.rent_amount).toLocaleString() },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'tenant_name', label: 'Current Tenant', render: r => r.tenant_name || <span className="text-gray-400">Vacant</span> },
    {
      key: 'actions', label: 'Actions',
      render: r => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-xs font-semibold px-2 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors">Edit</button>
          <button onClick={() => handleDelete(r.id)} className="text-xs font-semibold px-2 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        title="Houses"
        subtitle="Manage your rental properties"
        action={<button className="btn-primary" onClick={openCreate}>+ Add House</button>}
      />
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="mb-4">
        <input className="input-field max-w-sm" placeholder="Search houses..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <Spinner /> : <Table columns={columns} data={filtered} emptyMessage="No houses found. Add your first house." />}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add New House' : `Edit House — ${modal?.house_number}`}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">House Number *</label>
            <input className="input-field" value={form.house_number} onChange={e => setForm({ ...form, house_number: e.target.value })} required placeholder="e.g. A1, B2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field resize-none" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. 1 bedroom, ground floor" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount (KES) *</label>
            <input type="number" className="input-field" value={form.rent_amount} onChange={e => setForm({ ...form, rent_amount: e.target.value })} required min="0" />
          </div>
          {modal !== 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : modal === 'create' ? 'Create House' : 'Save Changes'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
