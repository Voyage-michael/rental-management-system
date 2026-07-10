import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, Modal, PageHeader, Alert, Spinner, StatusBadge } from '../../components/ui';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [resetModal, setResetModal] = useState(null);
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    api.get('/super-admin/admins').then(r => setAdmins(r.data.admins)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/super-admin/admins', form);
      setAlert({ type: 'success', message: 'Admin created successfully.' });
      setShowModal(false);
      setForm({ name: '', email: '', password: '', phone: '' });
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to create admin.' });
    } finally { setSaving(false); }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await api.patch(`/super-admin/admins/${id}/toggle-status`);
      setAlert({ type: 'success', message: `Admin ${isActive ? 'deactivated' : 'activated'}.` });
      fetch();
    } catch {
      setAlert({ type: 'error', message: 'Failed to update status.' });
    }
  };

  const handleReset = async () => {
    if (!newPassword || newPassword.length < 6) return setAlert({ type: 'error', message: 'Password must be at least 6 characters.' });
    try {
      await api.put(`/super-admin/users/${resetModal.id}/reset-password`, { newPassword });
      setAlert({ type: 'success', message: 'Password reset successfully.' });
      setResetModal(null);
      setNewPassword('');
    } catch {
      setAlert({ type: 'error', message: 'Failed to reset password.' });
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'house_count', label: 'Houses', render: r => r.house_count ?? 0 },
    { key: 'tenant_count', label: 'Tenants', render: r => r.tenant_count ?? 0 },
    { key: 'is_active', label: 'Status', render: r => <StatusBadge status={r.is_active ? 'active' : 'inactive'} /> },
    { key: 'created_at', label: 'Joined', render: r => new Date(r.created_at).toLocaleDateString() },
    {
      key: 'actions', label: 'Actions',
      render: r => (
        <div className="flex gap-2">
          <button onClick={() => handleToggle(r.id, r.is_active)}
            className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${r.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
            {r.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button onClick={() => setResetModal(r)}
            className="text-xs font-semibold px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors">
            Reset Pwd
          </button>
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Landlords"
        subtitle="Create and manage landlord accounts"
        action={<button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Landlord</button>}
      />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {loading ? <Spinner /> : <Table columns={columns} data={admins} emptyMessage="No landlords found." />}

      {/* Create Admin Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Landlord">
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
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Landlord'}</button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={!!resetModal} onClose={() => setResetModal(null)} title={`Reset Password — ${resetModal?.name}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" className="input-field" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6} />
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setResetModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleReset}>Reset Password</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
