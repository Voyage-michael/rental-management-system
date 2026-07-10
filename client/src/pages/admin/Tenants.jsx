import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, Modal, PageHeader, Alert, Spinner } from '../../components/ui';

const emptyForm = { name: '', email: '', phone: '', password: '', house_id: '', lease_start: '', lease_end: '' };

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState({ name: '', phone: '', lease_end: '' });
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = () => {
    setLoading(true);
    Promise.all([
      api.get('/tenants'),
      api.get('/houses'),
    ]).then(([tRes, hRes]) => {
      setTenants(tRes.data.tenants);
      setHouses(hRes.data.houses.filter(h => h.status === 'vacant'));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/tenants', form);
      setAlert({ type: 'success', message: 'Tenant registered successfully.' });
      setModal(false);
      setForm(emptyForm);
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to register tenant.' });
    } finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/tenants/${editModal.id}`, editForm);
      setAlert({ type: 'success', message: 'Tenant updated.' });
      setEditModal(null);
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    } finally { setSaving(false); }
  };

  const handleVacate = async (id, name) => {
    if (!confirm(`Mark ${name} as vacated? This will free up the house.`)) return;
    try {
      await api.patch(`/tenants/${id}/vacate`);
      setAlert({ type: 'success', message: 'Tenant vacated successfully.' });
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const filtered = tenants.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.house_number?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'house_number', label: 'House' },
    { key: 'rent_amount', label: 'Rent (KES)', render: r => Number(r.rent_amount).toLocaleString() },
    { key: 'lease_start', label: 'Lease Start', render: r => new Date(r.lease_start).toLocaleDateString() },
    { key: 'lease_end', label: 'Lease End', render: r => r.lease_end ? new Date(r.lease_end).toLocaleDateString() : <span className="badge-success">Active</span> },
    {
      key: 'actions', label: 'Actions',
      render: r => (
        <div className="flex gap-2">
          <button
            onClick={() => { setEditModal(r); setEditForm({ name: r.name, phone: r.phone || '', lease_end: r.lease_end || '' }); }}
            className="text-xs font-semibold px-2 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
          >Edit</button>
          {!r.lease_end && (
            <button
              onClick={() => handleVacate(r.id, r.name)}
              className="text-xs font-semibold px-2 py-1 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
            >Vacate</button>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tenants"
        subtitle="Register and manage your tenants"
        action={<button className="btn-primary" onClick={() => setModal(true)}>+ Register Tenant</button>}
      />
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="mb-4">
        <input className="input-field max-w-sm" placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <Spinner /> : <Table columns={columns} data={filtered} emptyMessage="No tenants registered yet." />}

      {/* Register Tenant Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Register New Tenant">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" className="input-field" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign House *</label>
            <select className="input-field" value={form.house_id} onChange={e => setForm({ ...form, house_id: e.target.value })} required>
              <option value="">-- Select Vacant House --</option>
              {houses.map(h => (
                <option key={h.id} value={h.id}>{h.house_number} — KES {Number(h.rent_amount).toLocaleString()}/mo</option>
              ))}
            </select>
            {houses.length === 0 && <p className="text-xs text-orange-600 mt-1">No vacant houses available. Please add houses first.</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start *</label>
              <input type="date" className="input-field" value={form.lease_start} onChange={e => setForm({ ...form, lease_start: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lease End (optional)</label>
              <input type="date" className="input-field" value={form.lease_end} onChange={e => setForm({ ...form, lease_end: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving || houses.length === 0}>{saving ? 'Registering...' : 'Register Tenant'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Tenant Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Edit Tenant — ${editModal?.name}`} size="sm">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input className="input-field" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input className="input-field" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date</label>
            <input type="date" className="input-field" value={editForm.lease_end} onChange={e => setEditForm({ ...editForm, lease_end: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setEditModal(null)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
