import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    icon: '🚀',
    title: 'Create Your Account',
    description: 'Sign up as a landlord in under 2 minutes. No credit card required to get started. Your account is ready instantly.',
    color: 'from-primary-500 to-primary-600',
    bg: 'bg-primary-50',
  },
  {
    number: '02',
    icon: '🏠',
    title: 'Add Your Properties',
    description: 'Create your property units — add house numbers, descriptions, and monthly rent amounts for each unit.',
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
  },
  {
    number: '03',
    icon: '👥',
    title: 'Register Your Tenants',
    description: 'Register each tenant with their contact details and assign them to a unit. They get their own login to the tenant portal.',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
  },
  {
    number: '04',
    icon: '💰',
    title: 'Collect & Record Rent',
    description: 'Record payments by cash, M-Pesa, or bank transfer. Balances and arrears are tracked automatically per tenant per month.',
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
  },
  {
    number: '05',
    icon: '📊',
    title: 'Generate Reports',
    description: 'View rent collection trends, occupancy rates, maintenance history, and water billing — all in beautiful charts and tables.',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
  },
];

export default function HowItWorks() {
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
    <section id="how-it-works" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Up and running in under 10 minutes
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            No training needed. No complicated setup. Just sign up and start managing.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-200 via-purple-200 to-orange-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map(({ number, icon, title, description, color, bg }, i) => (
              <div
                key={number}
                className={`flex flex-col items-center text-center transition-all duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Circle */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${color} shadow-lg flex items-center justify-center text-2xl mb-5 flex-shrink-0`}>
                  {icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-[10px] font-extrabold text-gray-500 shadow-sm">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5 text-base"
          >
            Get started — it's free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
