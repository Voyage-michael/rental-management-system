import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-2">
          Reset Password
        </h2>

        <p className="text-gray-500 mb-6">
          Enter your new password.
        </p>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              New Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                className="input-field pr-12"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-sm text-blue-600"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input-field pr-12"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-sm text-blue-600"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}