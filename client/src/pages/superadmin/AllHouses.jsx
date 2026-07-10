import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Table, PageHeader, Spinner, StatusBadge } from '../../components/ui';

export default function AllHouses() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/super-admin/houses').then(r => setHouses(r.data.houses)).finally(() => setLoading(false));
  }, []);

  const filtered = houses.filter(h =>
    h.house_number?.toLowerCase().includes(search.toLowerCase()) ||
    h.admin_name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'house_number', label: 'House No.' },
    { key: 'description', label: 'Description' },
    { key: 'rent_amount', label: 'Rent (KES)', render: r => Number(r.rent_amount).toLocaleString() },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'admin_name', label: 'Landlord' },
    { key: 'admin_email', label: 'Landlord Email' },
  ];

  return (
    <div>
      <PageHeader title="All Houses" subtitle="System-wide property registry" />
      <div className="mb-4">
        <input className="input-field max-w-sm" placeholder="Search house or landlord..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <Spinner /> : <Table columns={columns} data={filtered} emptyMessage="No houses found." />}
    </div>
  );
}
