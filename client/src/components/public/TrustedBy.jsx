const brands = [
  { name: 'Nairobi Properties', abbr: 'NP' },
  { name: 'Westlands Realty', abbr: 'WR' },
  { name: 'Kilimani Estates', abbr: 'KE' },
  { name: 'Parklands Holdings', abbr: 'PH' },
  { name: 'Lavington Group', abbr: 'LG' },
  { name: 'Karen Residences', abbr: 'KR' },
];

export default function TrustedBy() {
  return (
    <section className="py-14 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trusted by property managers across Kenya
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {brands.map(({ name, abbr }) => (
            <div
              key={name}
              className="flex items-center gap-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-primary-50 flex items-center justify-center text-xs font-extrabold text-gray-500 group-hover:text-primary-600 transition-colors">
                {abbr}
              </div>
              <span className="text-sm font-semibold whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
