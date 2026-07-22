import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: '🏠',
    title: 'Property Management',
    description: 'Add, edit and monitor all your rental units in one place. Track occupancy, set rent amounts, and get a real-time view of your entire portfolio.',
    color: 'bg-primary-50 text-primary-600',
    border: 'hover:border-primary-200',
  },
  {
    icon: '👥',
    title: 'Tenant Management',
    description: 'Register tenants, assign them to units, manage lease dates, and vacate them when needed — all with a few clicks.',
    color: 'bg-teal-50 text-teal-600',
    border: 'hover:border-teal-200',
  },
  {
    icon: '💰',
    title: 'Rent Collection',
    description: 'Record rent payments with M-Pesa, cash, or bank transfer. Automatically track balances, partial payments, and outstanding arrears.',
    color: 'bg-green-50 text-green-600',
    border: 'hover:border-green-200',
  },
  {
    icon: '💧',
    title: 'Water Billing',
    description: 'Enter meter readings and bills are auto-calculated instantly. Track paid and unpaid water bills per unit, per month.',
    color: 'bg-blue-50 text-blue-600',
    border: 'hover:border-blue-200',
  },
  {
    icon: '🔧',
    title: 'Maintenance Requests',
    description: 'Tenants submit requests from their portal. You track, prioritize, and update status in real time — with notes back to the tenant.',
    color: 'bg-orange-50 text-orange-600',
    border: 'hover:border-orange-200',
  },
  {
    icon: '📊',
    title: 'Reports & Analytics',
    description: 'Visualize rent collected by month, occupancy rates, maintenance trends, and water billing history with beautiful charts.',
    color: 'bg-purple-50 text-purple-600',
    border: 'hover:border-purple-200',
  },
  {
    icon: '🔐',
    title: 'Role-Based Access',
    description: 'Three-tier access control. Super admin oversees all landlords. Each landlord sees only their properties. Tenants see only their data.',
    color: 'bg-red-50 text-red-600',
    border: 'hover:border-red-200',
  },
  {
    icon: '☁️',
    title: 'Cloud SaaS Platform',
    description: 'Deployed on Vercel and Render with Railway MySQL. Access your dashboard from anywhere, on any device, at any time.',
    color: 'bg-sky-50 text-sky-600',
    border: 'hover:border-sky-200',
  },
  {
    icon: '📧',
    title: 'Email Notifications',
    description: 'Automated password reset emails via Nodemailer. More notification types (rent reminders, maintenance updates) coming in Phase 2.',
    color: 'bg-yellow-50 text-yellow-600',
    border: 'hover:border-yellow-200',
  },
];

function FeatureCard({ icon, title, description, color, border, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group bg-white border border-gray-100 ${border} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Everything you need to manage properties professionally
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            From a single bedsitter to a large apartment complex — RentFlow scales with your portfolio.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
