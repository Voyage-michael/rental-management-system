import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for landlords just getting started with digital property management.',
    features: [
      'Up to 10 units',
      'Unlimited tenants',
      'Rent payment tracking',
      'Maintenance requests',
      'Water billing',
      'Basic dashboard',
      'Email support',
    ],
    cta: 'Start Free',
    href: '/register',
    highlight: false,
    badge: null,
  },
  {
    name: 'Professional',
    price: 'KES 2,500',
    period: '/month',
    description: 'For growing landlords who need more power, more units, and advanced reporting.',
    features: [
      'Up to 100 units',
      'Everything in Starter',
      'Advanced analytics & charts',
      'CSV & PDF exports',
      'Priority email support',
      'SMS notifications',
      'Custom branding',
      'Multi-property dashboard',
    ],
    cta: 'Coming Soon',
    href: '#',
    highlight: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large property management companies managing hundreds of units across multiple sites.',
    features: [
      'Unlimited units',
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations',
      'M-Pesa direct integration',
      'White-label option',
      'SLA guarantee',
      'Phone support',
    ],
    cta: 'Coming Soon',
    href: '#',
    highlight: false,
    badge: null,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Start free. Scale when ready.
          </h2>
          <p className="text-gray-500 text-base">
            No hidden fees. No contracts. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map(({ name, price, period, description, features, cta, href, highlight, badge }) => (
            <div
              key={name}
              className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
                highlight
                  ? 'bg-primary-600 border-primary-500 shadow-2xl shadow-primary-200 scale-[1.03]'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
            >
              {badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-accent-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                    {badge}
                  </span>
                </div>
              )}

              <div className="p-7 flex-1">
                <h3 className={`text-base font-bold mb-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-4xl font-extrabold ${highlight ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  {period && <span className={`text-sm font-medium pb-1 ${highlight ? 'text-primary-200' : 'text-gray-400'}`}>{period}</span>}
                </div>
                <p className={`text-sm mb-6 leading-relaxed ${highlight ? 'text-primary-100' : 'text-gray-500'}`}>{description}</p>

                <ul className="space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${highlight ? 'bg-white/20' : 'bg-green-100'}`}>
                        <svg className={`w-3 h-3 ${highlight ? 'text-white' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={`text-sm ${highlight ? 'text-primary-100' : 'text-gray-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-7 pb-7">
                {cta === 'Start Free' ? (
                  <Link
                    to={href}
                    className={`block w-full text-center font-bold py-3 rounded-xl transition-all duration-200 text-sm ${
                      highlight
                        ? 'bg-white text-primary-600 hover:bg-primary-50'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {cta}
                  </Link>
                ) : (
                  <div className={`w-full text-center font-bold py-3 rounded-xl text-sm cursor-not-allowed ${
                    highlight
                      ? 'bg-white/20 text-white/80'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    🚧 {cta}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Professional and Enterprise tiers are under development and will be available soon. Stay tuned.
        </p>
      </div>
    </section>
  );
}
