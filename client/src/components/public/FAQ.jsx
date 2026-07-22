import { useState } from 'react';

const faqs = [
  {
    q: 'Is RentFlow really free to get started?',
    a: 'Yes — the Starter plan is completely free with no credit card required. You can manage up to 10 units, register unlimited tenants, and use all core features including rent tracking, water billing, and maintenance requests.',
  },
  {
    q: 'Can tenants log in to see their own information?',
    a: 'Yes. When you register a tenant, they get their own login credentials. They can view their rent payment history, check water bills, submit maintenance requests, and track request status — without seeing anyone else\'s data.',
  },
  {
    q: 'Is my data secure and separate from other landlords?',
    a: 'Absolutely. RentFlow is built with multi-tenancy at its core. Every piece of data is tied to your landlord account (admin_id). You can never see another landlord\'s properties or tenants, and they can\'t see yours.',
  },
  {
    q: 'How does water billing work?',
    a: 'You enter the previous and current meter readings for each unit. RentFlow automatically calculates units consumed and generates the bill at your configured rate per unit. Bills are linked to the correct tenant and marked paid or unpaid.',
  },
  {
    q: 'What payment methods can I record?',
    a: 'You can record rent payments made via Cash, M-Pesa, Bank Transfer, or Cheque. Each payment stores the reference number, date, and any notes. Partial payments are tracked with an automatic balance calculation.',
  },
  {
    q: 'Can I manage multiple buildings or properties?',
    a: 'Yes. You can add as many houses/units as your plan allows. There\'s no limit on the number of buildings. Simply create units with unique house numbers and assign tenants to each one.',
  },
  {
    q: 'What happens when a tenant moves out?',
    a: 'You can vacate a tenant from your dashboard with one click. This records the lease end date, marks the unit as vacant, and the tenant\'s access is effectively ended. The unit then becomes available for a new tenant.',
  },
  {
    q: 'Is RentFlow mobile-friendly?',
    a: 'Yes. The entire platform — both the landlord dashboard and the tenant portal — is fully responsive and works on any smartphone, tablet, or desktop browser. No app download needed.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-500 text-base">
            Can't find your answer? Email us at{' '}
            <a href="mailto:support@rentflow.co.ke" className="text-primary-600 hover:underline font-medium">
              support@rentflow.co.ke
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                open === i ? 'border-primary-200 shadow-sm' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`text-sm font-semibold pr-4 ${open === i ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-600'} transition-colors`}>
                  {q}
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  open === i ? 'bg-primary-600 rotate-180' : 'bg-gray-100 group-hover:bg-primary-50'
                }`}>
                  <svg className={`w-3.5 h-3.5 ${open === i ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48' : 'max-h-0'}`}>
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
