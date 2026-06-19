import React, { useState, useEffect } from 'react';
import API_URL from '../api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../assets/usericon.png';

const RecommendedMentors = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  // New state to track connection status per user ID: 'sending' | 'sent' | undefined
  const [requestStatus, setRequestStatus] = useState({}); 
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('id');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/recommendations/${currentUserId}`);
        setRecommendations(res.data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) fetchRecommendations();
  }, [currentUserId]);

  // --- NEW: Handle Connect Logic ---
  const handleConnect = async (receiverId) => {
    if (!currentUserId) return;

    // 1. Set state to sending
    setRequestStatus(prev => ({ ...prev, [receiverId]: 'sending' }));

    try {
      // 2. Call the connection endpoint
      await axios.post(`${API_URL}/api/connection/send-request`, {
        senderId: currentUserId,
        receiverId,
      });

      // 3. Set state to sent on success
      setRequestStatus(prev => ({ ...prev, [receiverId]: 'sent' }));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to connect");
      // Reset status if failed so user can try again
      setRequestStatus(prev => ({ ...prev, [receiverId]: undefined }));
    }
  };

  if (loading) return <div className="p-6 text-center text-sm opacity-60" style={{color: 'var(--cream-50)'}}>Analysing skills for matches...</div>;
  
  // Handle empty state gracefully (from previous fix)
  if (recommendations.length === 0) return (
    <div className="p-8 text-center border border-dashed border-gray-700 rounded-xl mt-12 mb-12" style={{background: 'rgba(255,250,240,0.02)'}}>
      <h3 className="text-xl font-bold" style={{color: 'var(--cream-50)'}}>No AI Matches Yet</h3>
      <p className="text-sm mt-2 mb-4" style={{color: 'rgba(255,250,240,0.6)'}}>
        Add "Learning" interests to your profile to see matches.
      </p>
      <button onClick={() => navigate('/edit-profile')} className="px-4 py-2 rounded-lg font-bold text-sm" style={{background: 'var(--mint-600)', color: '#041f2d'}}>
        Update Profile
      </button>
    </div>
  );

  return (
    <div className="rec-container mt-12 mb-12">
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --card-bg: rgba(255,250,240,0.03);
          --card-border: rgba(255,250,240,0.08);
          --cream-50: #fffaf0;
        }

        .rec-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .ai-badge {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          letter-spacing: 0.5px;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
        }

        .rec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .rec-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .rec-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.5);
          border-color: rgba(45, 212, 191, 0.3);
        }

        .rec-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(45,212,191,0.1);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }
        
        .match-score {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .match-label {
          font-size: 10px;
          text-transform: uppercase;
          color: rgba(255,250,240,0.5);
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .skill-pill {
          font-size: 12px;
          background: rgba(7, 16, 37, 0.6);
          border: 1px solid rgba(255,250,240,0.1);
          color: rgba(255,250,240,0.8);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .btn-connect-rec {
          width: 100%;
          margin-top: 16px;
          padding: 10px;
          border-radius: 10px;
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          color: #041f2d;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-connect-rec:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        /* Disabled state for "Sent" or "Sending" */
        .btn-connect-rec:disabled {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          cursor: default;
          box-shadow: none;
        }
      `}</style>

      <div className="rec-header">
        <h3 className="text-2xl font-bold" style={{color: 'var(--cream-50)'}}>Recommended Mentors</h3>
        <span className="ai-badge">AI MATCH</span>
      </div>
      
      <div className="rec-grid">
        {recommendations.map((user) => {
          const status = requestStatus[user._id]; // Get status for this specific user
          const isSent = status === 'sent';
          const isSending = status === 'sending';

          return (
            <div key={user._id} className="rec-card">
              
              {/* Top Section: Avatar + Score */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="rec-avatar">
                    <img src={user.avatar || profileIcon} alt={user.username} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-lg leading-tight" style={{color: 'var(--cream-50)'}}>
                      {user.username}
                    </div>
                    <div className="text-xs opacity-60" style={{color: 'var(--cream-50)'}}>
                      {user.email ? user.email.split('@')[0] : 'User'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="match-score">{user.matchScore}%</div>
                  <div className="match-label">Match</div>
                </div>
              </div>

              {/* Middle Section: Skills */}
              <div className="mb-4">
                <div className="text-xs font-semibold mb-2 opacity-50" style={{color: 'var(--cream-50)'}}>TEACHES</div>
                <div className="flex flex-wrap gap-2">
                  {user.skills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 4 && (
                    <span className="skill-pill opacity-50">+{user.skills.length - 4}</span>
                  )}
                </div>
              </div>

              {/* Bottom: Action - CHANGED TO CONNECT BUTTON */}
              <button 
                onClick={() => handleConnect(user._id)}
                disabled={isSent || isSending}
                className="btn-connect-rec"
              >
                {isSent ? 'Request Sent' : (isSending ? 'Sending...' : 'Connect')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedMentors;