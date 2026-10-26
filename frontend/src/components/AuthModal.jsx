import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEnvelope,
  faLock,
  faUser,
  faEye,
  faEyeSlash,
  faSpinner,
  faArrowRight,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { loginUser, registerUser } from "../api";
import { AuthContext } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose, onSuccess, defaultRole = "user" }) => {
  const { login } = useContext(AuthContext) || {};

  // 'login' or 'register'
  const [activeTab, setActiveTab] = useState("login");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setActiveTab("login");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    setSuccessMsg("");
    setLoading(false);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccessMsg("");
  };

  const persistAuthSession = (authData) => {
    const token = authData.token || "session-token";
    const userId = authData.userId || authData.id;
    const userRole = authData.role || (defaultRole === "admin" ? "ROLE_ADMIN" : "ROLE_CUSTOMER");
    const userName = authData.name || (name ? name.trim() : "User");
    const userEmail = authData.email || email.trim();

    const userData = {
      userId,
      id: userId,
      name: userName,
      email: userEmail,
      role: userRole,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userId);
    localStorage.setItem("userRole", userRole);

    if (login) {
      login(userData, token);
    }

    if (onSuccess) {
      onSuccess(userData);
    }
  };

  // 1. Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await loginUser({
        email: email.trim(),
        password: password,
      });

      setSuccessMsg("Logged in successfully! Redirecting...");
      persistAuthSession(res.data);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: defaultRole === "admin" ? "ROLE_ADMIN" : "ROLE_CUSTOMER",
      });

      setSuccessMsg("Account created successfully! Logging you in...");
      persistAuthSession(res.data);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create account. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-rose-100 my-8 transition-all transform animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
          title="Close"
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faTimes} className="text-sm" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-3xl shadow-inner mb-3">
            🧸
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {activeTab === "login" ? "Welcome Back!" : "Create an Account"}
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {activeTab === "login"
              ? "Sign in with your email & password to continue"
              : "Register to enjoy quick checkout and track your orders"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-6 border border-gray-200/50">
          <button
            type="button"
            onClick={() => handleTabSwitch("login")}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-200 ${
              activeTab === "login"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("register")}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-200 ${
              activeTab === "register"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
            <FontAwesomeIcon icon={faExclamationCircle} className="shrink-0 text-rose-500 text-sm" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
            <FontAwesomeIcon icon={faCheckCircle} className="shrink-0 text-emerald-500 text-sm" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form: LOGIN */}
        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-200 transition duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("register")}
                  className="font-bold text-rose-500 hover:text-rose-600 hover:underline"
                >
                  Create one now
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* Form: REGISTER */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-11 py-2.5 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-11 py-2.5 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-200 transition duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className="font-bold text-rose-500 hover:text-rose-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;