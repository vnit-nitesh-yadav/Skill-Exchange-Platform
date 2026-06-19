import React, { useState, useEffect, useRef } from "react";
import profileIcon from "../assets/usericon.png";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-container w-full px-6 py-4 shadow-md relative z-50">
      {/* Inline Theme Styling */}
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --cream-200: rgba(255,250,240,0.85);
        }

        .navbar-container {
          background: rgba(7, 16, 37, 0.45);
          border-bottom: 1px solid rgba(255, 250, 240, 0.06);
          backdrop-filter: blur(10px);
        }

        .nav-title {
          background: linear-gradient(90deg, var(--mint-500), #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-link {
          color: var(--cream-200);
          font-weight: 500;
          transition: 0.2s ease;
        }

        .nav-link:hover {
          color: var(--mint-500);
        }

        .nav-btn {
          padding: 8px 16px;
          border-radius: 8px;
          transition: 0.2s ease;
          font-weight: 600;
        }

        .nav-btn-primary {
          background: var(--mint-600);
          color: #041f2d;
        }
        .nav-btn-primary:hover {
          background: var(--mint-500);
        }

        .nav-btn-outline {
          border: 1px solid rgba(255,250,240,0.1);
        }
        .nav-btn-outline:hover {
          border-color: var(--mint-500);
          color: var(--mint-500);
        }

        .nav-icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,250,240,0.06);
          border: 1px solid rgba(255,250,240,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
        }

        .nav-icon-btn:hover {
          border-color: var(--mint-600);
          transform: scale(1.1);
        }

        .profile-img {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          transition: 0.2s ease;
          border: 1px solid rgba(255,250,240,0.08);
          padding: 2px;
          background: rgba(255,250,240,0.03);
        }

        .profile-img:hover {
          border-color: var(--mint-600);
          transform: scale(1.1);
        }

        .dropdown-menu {
          position: absolute;
          right: 20px;
          top: 72px;
          background: rgba(7, 16, 37, 0.95);
          border: 1px solid rgba(255,250,240,0.08);
          border-radius: 14px;
          width: 220px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.25);
          z-index: 60;
          overflow: hidden;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 12px 16px;
          color: var(--cream-200);
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.15s ease;
        }

        .dropdown-item:hover {
          background: rgba(255,250,240,0.08);
          color: var(--mint-500);
        }
      `}</style>

      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-3xl font-extrabold nav-title tracking-wide">
            SkillExchange
          </h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-6">

          {/* If logged in */}
          {isLoggedIn ? (
            <>
              {/* Notifications icon */}
              <Link to="/request">
                <div className="nav-icon-btn cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="var(--mint-500)"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.657a2 2 0 11-3.714 0M12 6v6m0 0l2-2m-2 2l-2-2m10.5-1.5v4.75A2.25 2.25 0 0118.25 17H5.75A2.25 2.25 0 013.5 14.25v-4.75A2.25 2.25 0 015.75 7.25h12.5A2.25 2.25 0 0120.5 9.75z"
                    />
                  </svg>
                </div>
              </Link>

              {/* Profile Templates */}
              <Link to="/profile-templates" className="nav-btn nav-btn-outline">
                Templates
              </Link>

              {/* Profile Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  className="profile-img"
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <img
                    src={profileIcon}
                    alt="Profile"
                    className="profile-img"
                  />
                </button>

                {menuOpen && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>
                      My Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/edit-profile'); }}>
                      Edit Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/search-skills'); }}>
                      Discover Skills
                    </button>
                    <button className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/chat'); }}>
                      Chat
                    </button>
                    <button className="dropdown-item" onClick={() => { setMenuOpen(false); onLogout?.(); navigate('/'); }}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login */}
              <Link to="/login" className="nav-btn nav-btn-outline">
                Login
              </Link>

              {/* Register */}
              <Link to="/register" className="nav-btn nav-btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
