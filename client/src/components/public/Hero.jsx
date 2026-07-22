import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const ref = useRef(null);
  useEffect(() => {
    if (!start) return;
    const el = ref.current;
    if (!el) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString() + (progress < 1 ? '' : '+');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + '+';
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return ref;
}

const FloatingCard = ({ className, children }) => (
  <div className={`absolute bg-white rounded-2xl shadow-xl border border-gray-100 p-3 ${className}`}>
    {children}
  </div>
);

export default function Hero() {
  const sectionRef = useRef(null);
  const visible = useRef(false);

  // Trigger counters on mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) visible.current = true; },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/40 to-white pt-16"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-primary-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-primary-200/20 rounded-full blur-2xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
              Trusted by landlords across Kenya
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
              Smart Property{' '}
              <span className="relative">
                <span className="text-primary-600">Management</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9C50 4 100 2 150 5C200 8 250 6 298 3" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </span>{' '}
              Made Simple
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Manage properties, collect rent, track water bills, and handle maintenance — all in one beautiful dashboard built for modern landlords.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5 text-base"
              >
                Start Free Today
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-4 rounded-2xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 text-base"
              >
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See Features
              </button>
            </div>

            {/* Trust stats */}
            <div className="flex items-center gap-8 justify-center lg:justify-start">
              {[
                { value: '500', label: 'Properties' },
                { value: '1.2K', label: 'Tenants' },
                { value: '98%', label: 'Uptime' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard Illustration */}
          <div className="relative hidden lg:block">
            {/* Main dashboard card */}
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Dashboard header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-sm">RentFlow Dashboard</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
              </div>

              {/* Dashboard body */}
              <div className="p-6 bg-gray-50">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Houses', value: '24', color: 'bg-primary-50 text-primary-600', icon: '🏠' },
                    { label: 'Tenants', value: '21', color: 'bg-green-50 text-green-600', icon: '👥' },
                    { label: 'Rent Due', value: 'KES 84K', color: 'bg-accent-400/10 text-accent-600', icon: '💰' },
                  ].map(({ label, value, color, icon }) => (
                    <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center text-sm mb-2`}>{icon}</div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-extrabold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Chart bars */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-700">Rent Collection — 2024</p>
                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">↑ 12%</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-16">
                    {[40, 65, 55, 80, 70, 90, 85, 95, 75, 88, 92, 98].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end">
                        <div
                          className={`rounded-sm transition-all ${i === 11 ? 'bg-primary-600' : 'bg-primary-200'}`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['J','F','M','A','M','J','J','A','S','O','N','D'].map(m => (
                      <span key={m} className="text-[9px] text-gray-400 flex-1 text-center">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Recent Payments</p>
                  {[
                    { name: 'House A1', amount: 'KES 15,000', status: 'Paid', color: 'text-green-600 bg-green-50' },
                    { name: 'House B3', amount: 'KES 25,000', status: 'Paid', color: 'text-green-600 bg-green-50' },
                    { name: 'House C2', amount: 'KES 12,000', status: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
                  ].map(({ name, amount, status, color }) => (
                    <div key={name} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center text-[10px]">🏠</div>
                        <div>
                          <p className="text-[11px] font-semibold text-gray-800">{name}</p>
                          <p className="text-[10px] text-gray-400">{amount}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <FloatingCard className="animate-float -top-6 -left-8 w-44">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-sm">✅</div>
                <div>
                  <p className="text-[10px] text-gray-500">Rent Collected</p>
                  <p className="text-sm font-extrabold text-gray-900">KES 420K</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="animate-float-delayed -bottom-4 -right-6 w-40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center text-sm">🔧</div>
                <div>
                  <p className="text-[10px] text-gray-500">Maintenance</p>
                  <p className="text-sm font-extrabold text-gray-900">2 Pending</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="animate-float top-1/3 -right-10 w-36">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-sm">💧</div>
                <div>
                  <p className="text-[10px] text-gray-500">Water Bills</p>
                  <p className="text-sm font-extrabold text-gray-900">Auto-gen</p>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <p className="text-xs text-gray-400 font-medium">Scroll to explore</p>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
