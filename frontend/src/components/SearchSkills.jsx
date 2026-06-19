import React, { useState } from 'react';
import API_URL from '../api';
import axios from 'axios';
import { FaSearch, FaRegSadTear } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../assets/usericon.png';

function SearchSkills() {
  const [skill, setSkill] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [globalLoading, setGlobalLoading] = useState(false);
  const [sendingIds, setSendingIds] = useState([]); // track per-user sending state
  const [sentRequest, setSentRequest] = useState([]); // list of receiverIds already requested
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e && e.preventDefault && e.preventDefault();
    if (!skill.trim()) {
      setError('Please enter a skill to search');
      setUsers([]);
      return;
    }

    setGlobalLoading(true);
    setError('');
    setUsers([]);
    try {
      // your original API used port 5050 for search
      const response = await axios.get(`${API_URL}/api/search/skills`, {
        params: { skill: skill.trim() },
      });

      const data = response.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
        setError('');
      } else {
        setUsers([]);
        setError('No users found with this skill');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching users. Please try again.');
      setUsers([]);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleSendRequest = async (receiverId) => {
    if (!receiverId) return;
    const senderId = localStorage.getItem('id');
    if (!senderId) {
      setError('You must be logged in to send requests.');
      return;
    }

    // prevent duplicate clicks
    if (sendingIds.includes(receiverId) || sentRequest.includes(receiverId)) return;

    setSendingIds((s) => [...s, receiverId]);
    try {
      const response = await axios.post(`${API_URL}/api/connection/send-request`, {
        senderId,
        receiverId,
      });

      // mark as sent
      setSentRequest((prev) => [...prev, receiverId]);
      // optional: remove sending state
      setSendingIds((s) => s.filter((id) => id !== receiverId));
      // message feedback (could be replaced with a toast)
      alert(response.data?.message || 'Request sent');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error sending request.';
      alert(msg);
      setSendingIds((s) => s.filter((id) => id !== receiverId));
    }
  };

  return (
    <div className="search-page min-h-screen p-6 flex items-center justify-center">
      <style>{`
        :root{
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --card-bg: rgba(255,250,240,0.03);
          --card-border: rgba(255,250,240,0.06);
        }

        .search-page {
          background: linear-gradient(180deg, var(--navy-900) 0%, var(--navy-950) 100%);
          color: var(--cream-50);
        }

        .panel {
          width: 100%;
          max-width: 980px;
          background: linear-gradient(180deg, rgba(255,250,240,0.02), rgba(255,250,240,0.01));
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 12px 40px rgba(2,6,23,0.6);
        }

        .search-row { display:flex; gap:12px; align-items:center; margin-bottom:14px; }
        .search-input {
          flex:1;
          padding:12px 14px;
          border-radius:10px;
          border:1px solid rgba(255,250,240,0.06);
          background: rgba(255,250,240,0.03);
          color: var(--cream-50);
          outline: none;
        }
        .search-input:focus { box-shadow: 0 0 0 4px rgba(45,212,191,0.08); border-color: var(--mint-600); }

        .search-btn {
          background: linear-gradient(90deg,var(--mint-600),var(--mint-500));
          color: #041f2d;
          padding: 10px 16px;
          border-radius: 12px;
          border: none;
          font-weight:700;
          cursor: pointer;
        }
        .search-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .card {
          background: rgba(255,250,240,0.02);
          border: 1px solid rgba(255,250,240,0.03);
          padding:14px;
          border-radius:12px;
          display:flex;
          gap:12px;
          align-items:flex-start;
          transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
        }
        .card:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(2,6,23,0.5); background: rgba(255,250,240,0.03); }

        .avatar {
          width:64px; height:64px; border-radius:12px; overflow:hidden; background: rgba(45,212,191,0.06);
          display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,250,240,0.03);
        }
        .avatar img { width:100%; height:100%; object-fit:cover; }

        .user-info { flex:1; }
        .username { font-weight:800; color: var(--mint-500); }
        .user-meta { color: rgba(255,250,240,0.8); font-size:13px; margin-top:6px; }

        .connect-btn {
          background: linear-gradient(90deg,var(--mint-600),var(--mint-500));
          color:#041f2d;
          padding:8px 12px;
          border-radius:10px;
          border:none;
          font-weight:700;
          cursor:pointer;
        }
        .connect-btn[disabled] { opacity:0.6; cursor:not-allowed; }
        .connect-btn-muted {
          background: rgba(255,255,255,0.04);
          color: rgba(255,250,240,0.9);
          border:1px solid rgba(255,250,240,0.04);
        }

        .empty {
          text-align:center;
          padding:28px;
          border-radius:10px;
          color: rgba(255,250,240,0.72);
        }

        @media (max-width:720px) {
          .search-row { flex-direction:column; align-items:stretch; }
          .search-btn { width:100%; }
          .card { flex-direction:row; gap:12px; }
        }
      `}</style>

      <div className="panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--mint-500)' }}>Search users by skill</h2>
            <div style={{ color: 'rgba(255,250,240,0.78)', marginTop: 6 }}>Find learners & mentors who match your interests</div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigate('/')}
              className="search-btn"
              style={{ background: 'transparent', color: 'var(--cream-50)', border: '1px solid rgba(255,250,240,0.06)' }}
            >
              Close
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="search-row" role="search" aria-label="Search users by skill">
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              className="search-input"
              placeholder="e.g. React, Design, Python"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              aria-label="Skill to search"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e); }}
            />
            <FaSearch style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,250,240,0.6)' }} />
          </div>

          <button type="submit" className="search-btn" disabled={globalLoading}>
            {globalLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="empty" style={{ marginTop: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{error}</div>
            <FaRegSadTear style={{ marginTop: 8, color: 'rgba(255,250,240,0.48)', fontSize: 36 }} />
          </div>
        )}

        {!error && !globalLoading && users.length === 0 && !skill && (
          <div className="empty" style={{ marginTop: 18 }}>
            <FaSearch style={{ fontSize: 42, color: 'var(--mint-500)' }} />
            <div style={{ marginTop: 10 }}>Start by searching for a skill</div>
          </div>
        )}

        {globalLoading && (
          <div className="empty" style={{ marginTop: 18 }}>
            Searching...
          </div>
        )}

        {users.length > 0 && (
          <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
            {users.map((user) => {
              const isSent = sentRequest.includes(user._id);
              const isSending = sendingIds.includes(user._id);
              return (
                <div key={user._id} className="card" role="article" aria-label={`User ${user.username}`}>
                  <div className="avatar" aria-hidden>
                    <img src={user.avatar || profileIcon} alt={user.username || 'User avatar'} />
                  </div>

                  <div className="user-info">
                    <div className="username">{user.username || 'Unknown'}</div>
                    <div className="user-meta">{user.email || 'No email provided'}</div>
                    <div style={{ marginTop: 8, color: 'rgba(255,250,240,0.82)', fontSize: 13 }}>
                      {Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || '')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    {isSent ? (
                      <button className="connect-btn connect-btn-muted" disabled>
                        Sent
                      </button>
                    ) : (
                      <button
                        className="connect-btn"
                        onClick={() => handleSendRequest(user._id)}
                        disabled={isSending}
                      >
                        {isSending ? 'Sending...' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchSkills;
