import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, Modal, PageHeader, Alert, Spinner, StatusBadge } from '../../components/ui';

const emptyForm = { title: '', description: '', category: 'other', priority: 'medium' };

export default function TenantMaintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    api.get('/maintenance').then(r => setRequests(r.data.requests)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/maintenance', form);
      setAlert({ type: 'success', message: 'Maintenance request submitted. Your landlord has been notified.' });
      setShowModal(false);
      setForm(emptyForm);
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to submit request.' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: r => r.category?.replace('_', ' ') },
    { key: 'priority', label: 'Priority', render: r => <StatusBadge status={r.priority} /> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'admin_notes', label: 'Landlord Notes', render: r => r.admin_notes || <span className="text-gray-400">—</span> },
    { key: 'created_at', label: 'Submitted', render: r => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <PageHeader
        title="Maintenance Requests"
        subtitle="Submit and track your maintenance requests"
        action={<button className="btn-primary" onClick={() => setShowModal(true)}>+ New Request</button>}
      />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {loading ? <Spinner /> : (
        <Table
          columns={columns}
          data={requests}
          emptyMessage="No maintenance requests yet. Submit one if something needs fixing."
        />
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Submit Maintenance Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
            <input
              className="input-field"
              placeholder="e.g. Leaking kitchen tap"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="structural">Structural</option>
                <option value="pest_control">Pest Control</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select className="input-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              className="input-field resize-none"
              rows={4}
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
