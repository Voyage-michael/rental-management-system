import { useState } from 'react';

const testimonials = [
  {
    name: 'John Mwangi',
    role: 'Landlord · 24 Units · Nairobi',
    avatar: 'JM',
    rating: 5,
    text: "RentFlow completely changed how I manage my properties. I used to spend entire weekends reconciling rent in Excel. Now it takes 10 minutes. The water billing alone saves me hours every month.",
    color: 'bg-primary-100 text-primary-700',
  },
  {
    name: 'Sarah Wanjiku',
    role: 'Property Manager · 3 Buildings · Mombasa',
    avatar: 'SW',
    rating: 5,
    text: "My tenants love the portal. They can see their rent history, submit maintenance requests, and check water bills without calling me. The maintenance tracking is exactly what I needed.",
    color: 'bg-teal-100 text-teal-700',
  },
  {
    name: 'Peter Otieno',
    role: 'Landlord · 8 Units · Kisumu',
    avatar: 'PO',
    rating: 5,
    text: "I tried multiple systems but they were either too expensive or too complicated. RentFlow is affordable, clean, and just works. Setup took less than 30 minutes for all my properties.",
    color: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Grace Njeri',
    role: 'Landlord · 15 Units · Westlands',
    avatar: 'GN',
    rating: 5,
    text: "The reports are incredible. I can see at a glance which tenants have arrears, which maintenance requests are pending, and how much I've collected this month. My accountant is happy too.",
    color: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'David Kamau',
    role: 'Property Manager · 40 Units · Kilimani',
    avatar: 'DK',
    rating: 5,
    text: "Managing 40 units used to be a nightmare. Now I have complete control from one dashboard. The multi-tenant architecture means my data is completely separate from other landlords — that's huge.",
    color: 'bg-green-100 text-green-700',
  },
];

const StarRating = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  // Show 3 cards on desktop, 1 on mobile
  const visible = [
    testimonials[(active) % testimonials.length],
    testimonials[(active + 1) % testimonials.length],
    testimonials[(active + 2) % testimonials.length],
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Landlords love RentFlow
          </h2>
          <p className="text-gray-500 text-base">
            Join hundreds of property managers who've made the switch.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visible.map(({ name, role, avatar, rating, text, color }, i) => (
            <div
              key={name + i}
              className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                i === 1 ? 'border-primary-200 shadow-md scale-[1.02]' : 'border-gray-100'
              }`}
            >
              <StarRating count={rating} />
              <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? 'bg-primary-600 w-6' : 'bg-gray-200 w-2 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
