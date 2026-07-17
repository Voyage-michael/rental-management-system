import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(res.data.message);
      setEmail("");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your email address and we'll send you a password reset link.
        </p>

        {message && (
          <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-3 mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <div className="text-center mt-6">

          <Link
            to="/login"
            className="text-primary-600 hover:underline"
          >
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}