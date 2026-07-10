import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, Spinner, PageHeader } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function TenantDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/tenants/my-profile'),
      api.get('/maintenance'),
      api.get('/water/bills'),
      api.get('/rent'),
    ]).then(([profileRes, maintRes, billsRes, rentRes]) => {
      setProfile(profileRes.data.tenant);
      setMaintenance(maintRes.data.requests);
      setBills(billsRes.data.bills);
      setPayments(rentRes.data.payments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const pendingRequests = maintenance.filter(r => r.status === 'pending').length;
  const unpaidBills = bills.filter(b => !b.is_paid).length;
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  const lastPayment = payments[0];

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Your tenancy overview"
      />

      {/* Property Info Card */}
      {profile && (
        <div className="card mb-6 bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Your House</p>
              <p className="text-2xl font-extrabold text-primary-700">{profile.house_number}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Monthly Rent</p>
              <p className="text-2xl font-extrabold text-gray-900">KES {Number(profile.rent_amount).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Lease Start</p>
              <p className="text-xl font-bold text-gray-700">{new Date(profile.lease_start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Landlord</p>
              <p className="text-xl font-bold text-gray-700">{profile.landlord_name}</p>
              <p className="text-sm text-gray-500">{profile.landlord_phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Requests" value={pendingRequests} icon="🔧" color="yellow" />
        <StatCard label="Unpaid Water Bills" value={unpaidBills} icon="💧" color="red" />
        <StatCard label="Total Payments Made" value={`KES ${totalPaid.toLocaleString()}`} icon="💰" color="green" />
        <StatCard
          label="Last Payment"
          value={lastPayment ? `KES ${Number(lastPayment.amount_paid).toLocaleString()}` : '—'}
          icon="📅"
          color="primary"
          sub={lastPayment ? lastPayment.month : 'No payments yet'}
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Submit Maintenance Request', href: '/tenant/maintenance', icon: '🔧', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
            { label: 'View Water Bills', href: '/tenant/water-bills', icon: '💧', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
            { label: 'View Rent History', href: '/tenant/rent-history', icon: '💰', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
          ].map(({ label, href, icon, color }) => (
            <a
              key={label}
              href={href}
              className={`${color} flex items-center gap-3 px-4 py-3 rounded-xl transition-colors`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-semibold">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
