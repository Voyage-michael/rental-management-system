import { useState } from 'react';

const tabs = ['Admin View', 'Tenant View', 'Super Admin View'];

const AdminMockup = () => (
  <div className="bg-gray-50 rounded-xl p-4">
    <div className="grid grid-cols-4 gap-3 mb-4">
      {[
        { label: 'Houses', value: '24', icon: '🏠', color: 'bg-primary-50' },
        { label: 'Tenants', value: '21', icon: '👥', color: 'bg-teal-50' },
        { label: 'Pending', value: '3', icon: '🔧', color: 'bg-yellow-50' },
        { label: 'Revenue', value: '420K', icon: '💰', color: 'bg-green-50' },
      ].map(({ label, value, icon, color }) => (
        <div key={label} className={`${color} rounded-xl p-3 border border-white`}>
          <div className="text-xl mb-1">{icon}</div>
          <p className="text-lg font-extrabold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-600 mb-3">Rent Collection</p>
        <div className="flex items-end gap-1 h-20">
          {[55, 70, 60, 85, 75, 95].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div className={`rounded-sm ${i === 5 ? 'bg-primary-600' : 'bg-primary-200'}`} style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-600 mb-2">Recent Payments</p>
        {['House A1 — KES 15,000', 'House B2 — KES 25,000', 'House C1 — KES 12,000'].map(t => (
          <div key={t} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
            <p className="text-xs text-gray-600">{t}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TenantMockup = () => (
  <div className="bg-gray-50 rounded-xl p-4">
    <div className="bg-gradient-to-r from-primary-50 to-white border border-primary-100 rounded-xl p-4 mb-4">
      <div className="flex gap-6 flex-wrap">
        {[
          { label: 'Your House', value: 'Unit A3' },
          { label: 'Monthly Rent', value: 'KES 15,000' },
          { label: 'Lease Start', value: 'Jan 2024' },
          { label: 'Landlord', value: 'J. Mwangi' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-xl p-3 border border-gray-100">
        <p className="text-xs font-semibold text-gray-600 mb-2">Maintenance Requests</p>
        {[
          { title: 'Leaking tap', status: 'In Progress', color: 'bg-blue-100 text-blue-700' },
          { title: 'Broken window', status: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
          { title: 'Power socket', status: 'Resolved', color: 'bg-green-100 text-green-700' },
        ].map(({ title, status, color }) => (
          <div key={title} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <p className="text-xs text-gray-700">{title}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{status}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-3 border border-gray-100">
        <p className="text-xs font-semibold text-gray-600 mb-2">Water Bills</p>
        {[
          { month: 'Dec 2024', amount: 'KES 850', paid: true },
          { month: 'Nov 2024', amount: 'KES 720', paid: true },
          { month: 'Oct 2024', amount: 'KES 930', paid: false },
        ].map(({ month, amount, paid }) => (
          <div key={month} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-xs font-semibold text-gray-700">{month}</p>
              <p className="text-[10px] text-gray-400">{amount}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {paid ? 'Paid' : 'Unpaid'}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SuperAdminMockup = () => (
  <div className="bg-gray-50 rounded-xl p-4">
    <div className="grid grid-cols-4 gap-3 mb-4">
      {[
        { label: 'Landlords', value: '14', icon: '👔', color: 'bg-purple-50' },
        { label: 'Total Tenants', value: '312', icon: '👥', color: 'bg-teal-50' },
        { label: 'All Houses', value: '280', icon: '🏘️', color: 'bg-primary-50' },
        { label: 'Revenue', value: '5.2M', icon: '💰', color: 'bg-green-50' },
      ].map(({ label, value, icon, color }) => (
        <div key={label} className={`${color} rounded-xl p-3 border border-white`}>
          <div className="text-xl mb-1">{icon}</div>
          <p className="text-lg font-extrabold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">All Landlords</p>
        <span className="text-xs text-primary-600 font-semibold">Manage</span>
      </div>
      {[
        { name: 'John Mwangi', houses: 24, tenants: 21, status: 'Active' },
        { name: 'Sarah Kamau', houses: 12, tenants: 10, status: 'Active' },
        { name: 'Peter Otieno', houses: 8, tenants: 6, status: 'Active' },
        { name: 'Grace Wanjiku', houses: 5, tenants: 3, status: 'Inactive' },
      ].map(({ name, houses, tenants, status }) => (
        <div key={name} className="flex items-center justify-between px-4 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-600">
              {name.charAt(0)}
            </div>
            <p className="text-xs font-semibold text-gray-700">{name}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-gray-400">{houses} houses · {tenants} tenants</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const mockups = [<AdminMockup />, <TenantMockup />, <SuperAdminMockup />];

export default function DashboardShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            Live Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            A dashboard for every role
          </h2>
          <p className="text-gray-500 text-base">
            Each user sees exactly what they need — nothing more, nothing less.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active === i
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Laptop frame */}
        <div className="relative mx-auto max-w-4xl">
          <div className="bg-gray-800 rounded-t-2xl px-4 pt-3 pb-0">
            {/* Laptop top bar */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <div className="flex-1 bg-gray-700 rounded-lg h-5 mx-4" />
            </div>
            {/* Screen */}
            <div className="bg-white rounded-t-lg overflow-hidden border border-gray-700">
              {/* Browser chrome */}
              <div className="bg-primary-700 px-4 py-2 flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-white text-xs font-bold">RentFlow</span>
                <div className="ml-auto text-white/50 text-[10px]">app.rentflow.co.ke</div>
              </div>
              {/* Dashboard content */}
              <div className="p-4 transition-all duration-300">
                {mockups[active]}
              </div>
            </div>
          </div>
          {/* Laptop base */}
          <div className="bg-gray-700 h-4 rounded-b-2xl" />
          <div className="bg-gray-600 h-2 rounded-b-xl mx-8" />
        </div>
      </div>
    </section>
  );
}
