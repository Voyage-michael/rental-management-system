import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl text-3xl mb-6 backdrop-blur-sm border border-white/20">
          🏠
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
          Ready to simplify your{' '}
          <span className="text-primary-200">property management?</span>
        </h2>

        <p className="text-primary-100 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          Join hundreds of landlords across Kenya who manage their properties smarter with RentFlow. Free to start, no credit card required.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-primary-700 font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-base"
          >
            Create Your Free Account
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 border border-white/30 hover:border-white/50 hover:-translate-y-0.5 text-base backdrop-blur-sm"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: '🔒', text: 'Secure & encrypted' },
            { icon: '⚡', text: '99.9% uptime' },
            { icon: '💳', text: 'No credit card needed' },
            { icon: '🌍', text: 'Made for Kenya' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-primary-100 text-sm">
              <span>{icon}</span>
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
