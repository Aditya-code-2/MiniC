import React, { useState, useEffect } from "react";
import API, { loginWithPassword } from "../api";

const AuthModal = ({ isOpen, onClose, onSuccess, defaultRole = "user" }) => {
  const [role, setRole] = useState(defaultRole); // 'user', 'seller', or 'admin'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
      resetModal();
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    // Redirect to Spring Security default OAuth2 login route
    window.location.href = `http://localhost:8086/oauth2/authorization/google?role=${role}`;
  };

  // 2. Handle Send Magic Link / OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      // API call to request Login OTP / Magic Link
      await API.post("/auth/send-otp", { email, role });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/verify-otp", { email, otp, role });

      // Save token to localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", role);
      }

      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await loginWithPassword(email, password);

      // Save token to localStorage
      const tokenToSave = res.data.token || "session-auth-token";
      localStorage.setItem("token", tokenToSave);
      localStorage.setItem("userRole", role);
      if (res.data.userId) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }

      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setOtpSent(false);
    setEmail("");
    setPassword("");
    setOtp("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-rose-100 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            resetModal();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-rose-100 hover:text-rose-500 font-bold transition"
        >
          ✕
        </button>

        {/* Role Toggle Switcher Removed as per request */}

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-3xl">🧸</span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            Welcome to MiniC
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Sign in with Google or Email OTP to shop
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Google OAuth Button - Only for Customers */}
        {!otpSent && role === "user" && (
          <>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm py-3 rounded-2xl transition shadow-sm mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-100"></div>
              <span className="px-3 text-[10px] font-bold uppercase text-gray-300">
                Or with Email OTP
              </span>
              <div className="flex-1 border-t border-gray-100"></div>
            </div>
          </>
        )}

        {/* Email Login Flow */}
        {role !== "user" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder={role === "admin" ? "admin@minic.com" : "seller@business.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-400 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-400 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg shadow-gray-200 transition active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : "Login Securely"}
            </button>
          </form>
        ) : !otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder={role === "user" ? "user@example.com" : role === "admin" ? "admin@minic.com" : "seller@business.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-200 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Get OTP / Magic Link"}
            </button>
          </form>
        ) : (
          /* OTP Verification Step */
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold uppercase text-gray-400">
                  Enter OTP Sent To Email
                </label>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[10px] text-rose-500 font-bold hover:underline"
                >
                  Change Email
                </button>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-center text-lg tracking-widest font-black focus:outline-none focus:border-rose-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-200 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AuthModal;