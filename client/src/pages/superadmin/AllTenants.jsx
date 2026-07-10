import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, PageHeader, Spinner } from '../../components/ui';

export default function AllTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/super-admin/tenants').then(r => setTenants(r.data.tenants)).finally(() => setLoading(false));
  }, []);

  const filtered = tenants.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.house_number?.toLowerCase().includes(search.toLowerCase()) ||
    t.admin_name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Tenant Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'house_number', label: 'House' },
    { key: 'rent_amount', label: 'Rent (KES)', render: r => Number(r.rent_amount).toLocaleString() },
    { key: 'admin_name', label: 'Landlord' },
    { key: 'lease_start', label: 'Lease Start', render: r => new Date(r.lease_start).toLocaleDateString() },
    { key: 'lease_end', label: 'Lease End', render: r => r.lease_end ? new Date(r.lease_end).toLocaleDateString() : 'Active' },
  ];

  return (
    <div>
      <PageHeader title="All Tenants" subtitle="System-wide tenant registry" />
      <div className="mb-4">
        <input
          className="input-field max-w-sm"
          placeholder="Search by name, email, house..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? <Spinner /> : <Table columns={columns} data={filtered} emptyMessage="No tenants found." />}
    </div>
  );
}
