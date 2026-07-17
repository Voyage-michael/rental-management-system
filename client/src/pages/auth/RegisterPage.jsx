import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4">
            <svg className="w-9 h-9 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" fill="white" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">RentFlow</h1>
          <p className="text-primary-200 mt-1 text-sm">Property Management Platform</p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your landlord account has been created successfully. You can now sign in and start managing your properties.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full py-3 text-base"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-sm text-gray-500 mb-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline">
                Sign in
              </Link>
            </p>

            {serverError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="John Mwangi"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Password <span className="text-red-500">*</span>
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      className={`input-field pr-12 ${
        errors.password ? "border-red-400 focus:ring-red-400" : ""
      }`}
      placeholder="Enter your password"
      value={form.password}
      onChange={handleChange}
      autoComplete="new-password"
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-primary-600"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  {errors.password && (
    <p className="text-red-500 text-xs mt-1">
      {errors.password}
    </p>
  )}
</div>

              {/* Confirm Password */}
             <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Confirm Password <span className="text-red-500">*</span>
  </label>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      className={`input-field pr-12 ${
        errors.confirmPassword ? "border-red-400 focus:ring-red-400" : ""
      }`}
      placeholder="Repeat your password"
      value={form.confirmPassword}
      onChange={handleChange}
      autoComplete="new-password"
      required
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-primary-600"
    >
      {showConfirmPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>
  </div>

  {errors.confirmPassword && (
    <p className="text-red-500 text-xs mt-1">
      {errors.confirmPassword}
    </p>
  )}
</div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-base"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-400">
              Registrations create a landlord account only. Tenants are added by their landlord.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
