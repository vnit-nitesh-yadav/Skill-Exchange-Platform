// src/components/Login.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/*
  Usage notes:
  - Set REACT_APP_API_URL in Vercel / .env (e.g. https://your-backend.onrender.com)
  - If your backend uses cookie-based auth, set REACT_APP_USE_COOKIES=true
*/

import API_URL from '../../api';

const USE_COOKIES = (process.env.REACT_APP_USE_COOKIES || "false").toLowerCase() === "true";

// axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  withCredentials: USE_COOKIES, // toggle for cookie auth
});

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const emailRef = useRef(null);

  // autofocus email field on mount
  React.useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    // basic client-side validation
    if (!email || !password) {
      setFieldErrors({
        email: !email ? "Email is required" : null,
        password: !password ? "Password is required" : null,
      });
      setLoading(false);
      return;
    }

    try {
      const resp = await api.post("/api/auth/login", { email, password });

      // if backend returns token in body (Bearer-style)
      if (resp?.data?.token) {
        localStorage.setItem("token", resp.data.token);
      }

      // optional: backend might set a cookie when USE_COOKIES=true
      if (resp?.data?.id) {
        localStorage.setItem("id", resp.data.id);
      }

      setSuccess("Login successful!");
      setIsLoggedIn?.(true);

      // clear sensitive value
      setPassword("");

      // navigate home (replace so back doesn't go back to login)
      navigate("/", { replace: true });
    } catch (err) {
      // handle validation errors from backend
      const rdata = err?.response?.data;
      if (rdata) {
        // common shapes: { error: "msg" } or { message: "msg" } or { errors: { email: '...' } }
        const msg = rdata.error || rdata.message || null;
        if (msg) setError(msg);

        if (rdata.errors && typeof rdata.errors === "object") {
          setFieldErrors(rdata.errors);
        } else if (rdata.fieldErrors && typeof rdata.fieldErrors === "object") {
          setFieldErrors(rdata.fieldErrors);
        } else if (!msg && err.response?.status === 401) {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        setError("Network error — please check your connection.");
      }
      // keep email but clear password to be safe
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen login-bg relative p-6">
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --cream-200: rgba(255,250,240,0.85);
        }
        .login-bg {
          background: linear-gradient(180deg, var(--navy-900), var(--navy-950));
          color: var(--cream-50);
        }
        .login-card {
          background: rgba(255, 250, 240, 0.04);
          border: 1px solid rgba(255, 250, 240, 0.08);
          backdrop-filter: blur(6px);
        }
        .login-input {
          background: rgba(255,250,240,0.02);
          border: 1px solid rgba(255,250,240,0.04);
          color: var(--cream-50);
        }
        .login-input:focus { outline: 2px solid var(--mint-600); }
        .btn-primary { background: var(--mint-600); color: #051826; }
        .btn-secondary { background: transparent; border: 1px solid rgba(255,250,240,0.08); color: var(--cream-50); }
        .error-text { color: #ffb4b4; }
        .success-text { color: #9be7cf; }
      `}</style>

      <form
        onSubmit={handleSubmit}
        className="login-card shadow-xl rounded-xl px-8 py-6 w-full max-w-sm"
        aria-labelledby="loginHeading"
      >
        <h2 id="loginHeading" className="text-3xl font-bold mb-4" style={{ color: "var(--mint-500)" }}>
          Welcome back
        </h2>

        {error && <div role="alert" className="error-text text-sm mb-3">{error}</div>}
        {success && <div role="status" className="success-text text-sm mb-3">{success}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-1" style={{ color: "var(--cream-200)" }}>
            Email
          </label>
          <input
            ref={emailRef}
            id="email"
            type="email"
            className="w-full px-3 py-2 rounded login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            autoComplete="email"
            disabled={loading}
          />
          {fieldErrors.email && <div id="email-error" className="error-text text-xs mt-1">{fieldErrors.email}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold mb-1" style={{ color: "var(--cream-200)" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 rounded login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{ position: "absolute", right: 8, top: 8 }}
              className="text-sm text-gray-300"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {fieldErrors.password && <div id="password-error" className="error-text text-xs mt-1">{fieldErrors.password}</div>}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary font-bold py-2 px-4 rounded ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="btn-secondary font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            Register
          </button>
        </div>

        <div className="mt-4 text-xs" style={{ color: "var(--cream-200)" }}>
          By continuing you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy</a>.
        </div>
      </form>
    </div>
  );
};

export default Login;
