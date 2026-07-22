import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 500, suffix: '+', label: 'Properties Managed', icon: '🏠', color: 'text-primary-600' },
  { value: 1200, suffix: '+', label: 'Active Tenants', icon: '👥', color: 'text-teal-600' },
  { value: 50, suffix: '+', label: 'Landlords Onboarded', icon: '👔', color: 'text-purple-600' },
  { value: 98, suffix: '%', label: 'Platform Uptime', icon: '⚡', color: 'text-green-600' },
  { value: 4200, suffix: '+', label: 'Rent Payments Recorded', icon: '💰', color: 'text-yellow-600' },
  { value: 800, suffix: '+', label: 'Maintenance Requests Resolved', icon: '🔧', color: 'text-orange-600' },
];

function AnimatedCounter({ value, suffix, color, started }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const duration = 2000;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(value);
    };
    requestAnimationFrame(step);
  }, [started, value]);

  return (
    <span className={`text-4xl font-extrabold ${color}`}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Numbers that speak for themselves
          </h2>
          <p className="text-primary-200 text-base">
            Growing every day as more landlords trust RentFlow with their portfolios.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map(({ value, suffix, label, icon, color }, i) => (
            <div
              key={label}
              className="text-center group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl text-2xl mb-4 group-hover:bg-white/20 transition-colors duration-200">
                {icon}
              </div>
              <div className="mb-1">
                <AnimatedCounter value={value} suffix={suffix} color="text-white" started={started} />
              </div>
              <p className="text-primary-200 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
