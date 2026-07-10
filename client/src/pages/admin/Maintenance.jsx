import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, Modal, PageHeader, Alert, Spinner, StatusBadge } from '../../components/ui';

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', admin_notes: '' });
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetch = () => {
    setLoading(true);
    api.get('/maintenance').then(r => setRequests(r.data.requests)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openUpdate = (req) => {
    setModal(req);
    setStatusForm({ status: req.status, admin_notes: req.admin_notes || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/maintenance/${modal.id}/status`, statusForm);
      setAlert({ type: 'success', message: 'Request updated successfully.' });
      setModal(null);
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    } finally { setSaving(false); }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const columns = [
    { key: 'tenant_name', label: 'Tenant' },
    { key: 'house_number', label: 'House' },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: r => <span className="capitalize">{r.category?.replace('_', ' ')}</span> },
    { key: 'priority', label: 'Priority', render: r => <StatusBadge status={r.priority} /> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'created_at', label: 'Submitted', render: r => new Date(r.created_at).toLocaleDateString() },
    {
      key: 'actions', label: 'Actions',
      render: r => (
        <button onClick={() => openUpdate(r)} className="text-xs font-semibold px-2 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors">
          Update
        </button>
      )
    },
  ];

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    resolved: requests.filter(r => r.status === 'resolved').length,
  };

  return (
    <div>
      <PageHeader title="Maintenance Requests" subtitle="Track and resolve tenant maintenance issues" />
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'all', label: `All (${counts.all})` },
          { key: 'pending', label: `Pending (${counts.pending})` },
          { key: 'in_progress', label: `In Progress (${counts.in_progress})` },
          { key: 'resolved', label: `Resolved (${counts.resolved})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === key ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : <Table columns={columns} data={filtered} emptyMessage="No maintenance requests." />}

      {/* Update Status Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={`Update Request — ${modal?.title}`}>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600"><span className="font-medium">Tenant:</span> {modal?.tenant_name} ({modal?.house_number})</p>
          <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Description:</span> {modal?.description}</p>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
            <select className="input-field" value={statusForm.status} onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (optional)</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={statusForm.admin_notes}
              onChange={e => setStatusForm({ ...statusForm, admin_notes: e.target.value })}
              placeholder="Add notes or update for the tenant..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Updating...' : 'Update Request'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
