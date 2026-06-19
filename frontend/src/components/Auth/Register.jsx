import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from '../../api';

const Register = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      setSuccess(response.data.message || "Registration successful!");
      // persist token and id
      if (response.data.token) localStorage.setItem("token", response.data.token);
      if (response.data.id) localStorage.setItem("id", response.data.id);

      props.setIsLoggedIn(true);
      // clear fields
      setUsername("");
      setEmail("");
      setPassword("");
      // redirect
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || err.response.data.message || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen register-bg relative">
      {/* Inline theme CSS (mint & deep navy) */}
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --cream-200: rgba(255,250,240,0.85);
        }
        .register-bg {
          background: linear-gradient(180deg, var(--navy-900), var(--navy-950));
          color: var(--cream-50);
        }
        .card {
          background: rgba(255,250,240,0.04);
          border: 1px solid rgba(255,250,240,0.08);
          backdrop-filter: blur(8px);
        }
        .close-btn {
          background: rgba(255,250,240,0.04);
          border: 1px solid rgba(255,250,240,0.06);
          color: var(--cream-50);
        }
        .input {
          background: rgba(255,250,240,0.03);
          border: 1px solid rgba(255,250,240,0.06);
          color: var(--cream-50);
        }
        .input:focus {
          outline: 2px solid var(--mint-600);
        }
        .btn-primary {
          background: var(--mint-600);
          color: #051826;
        }
        .btn-primary:hover { background: var(--mint-500); }
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255,250,240,0.08);
          color: var(--cream-50);
        }
        .btn-outline:hover {
          border-color: var(--mint-600);
          color: var(--mint-500);
        }
      `}</style>

      {/* Close */}
      <button
        className="absolute top-6 right-6 px-3 py-1 rounded close-btn hover:text-mint-500"
        onClick={() => navigate("/")}
      >
        ✕
      </button>

      <form onSubmit={handleSubmit} className="card rounded-xl px-8 py-6 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--mint-500)" }}>
          Create your account
        </h2>

        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-400">{success}</div>}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" style={{ color: "var(--cream-200)" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 rounded input"
            placeholder="choose a username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1" style={{ color: "var(--cream-200)" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded input"
            placeholder="you@domain.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1" style={{ color: "var(--cream-200)" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded input"
            placeholder="minimum 6 characters"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary font-bold py-2 px-4 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="btn-outline font-bold py-2 px-4 rounded"
          >
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
