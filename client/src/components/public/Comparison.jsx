const traditional = [
  'Paper rent receipts & ledgers',
  'WhatsApp messages for maintenance',
  'Manual water bill calculations',
  'Excel spreadsheets for tenant records',
  'No visibility into arrears',
  'No reports or analytics',
  'Easy to lose data',
  'No tenant self-service portal',
];

const rentflow = [
  'Digital payment records & history',
  'Structured maintenance request portal',
  'Auto-calculated water bills from readings',
  'Centralized tenant database',
  'Real-time arrears tracking per tenant',
  'Charts, trends & monthly reports',
  'Cloud-backed, always available',
  'Full tenant portal with self-service',
];

export default function Comparison() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            Why RentFlow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            The old way vs. the right way
          </h2>
          <p className="text-gray-500 text-base">
            Stop managing properties the hard way. RentFlow replaces every manual process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-base">😰</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Traditional Management</p>
                <p className="text-xs text-red-500 font-medium">Manual, slow, error-prone</p>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {traditional.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RentFlow */}
          <div className="bg-white border border-primary-200 rounded-2xl overflow-hidden shadow-lg relative">
            {/* Popular badge */}
            <div className="absolute top-4 right-4 bg-primary-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              RECOMMENDED
            </div>
            <div className="bg-gradient-to-r from-primary-50 to-primary-50/50 px-6 py-4 border-b border-primary-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center text-base">🚀</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">RentFlow Platform</p>
                <p className="text-xs text-primary-600 font-medium">Modern, fast, automated</p>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {rentflow.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
