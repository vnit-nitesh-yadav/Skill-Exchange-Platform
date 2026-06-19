import React, { useState, useEffect } from "react";
import API_URL from '../api';
import axios from "axios";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";

const ConnectedUsers = ({ currentUserId }) => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/connection/connected-users/${currentUserId}`
        );
        // Assume response.data is an array of user objects
        setConnectedUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching connected users", error);
      }
    };

    if (currentUserId) fetchConnectedUsers();
  }, [currentUserId]);

  return (
    <div className="min-h-screen connected-page p-6">
      {/* Inline theme CSS so colors apply immediately */}
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --card-bg: rgba(255,250,240,0.03);
          --card-border: rgba(255,250,240,0.06);
        }

        .connected-page {
          background: linear-gradient(180deg, var(--navy-900) 0%, var(--navy-950) 100%);
          color: var(--cream-50);
        }

        .panel {
          max-width: 920px;
          margin: 0 auto;
          background: linear-gradient(180deg, rgba(255,250,240,0.02), rgba(255,250,240,0.01));
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.6);
        }

        .user-item {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:10px 14px;
          border-radius:10px;
          background: rgba(255,250,240,0.02);
          border: 1px solid rgba(255,250,240,0.02);
          transition: transform 0.14s ease, background 0.14s ease, box-shadow 0.14s ease;
        }

        .user-item:hover {
          transform: translateY(-4px);
          background: rgba(255,250,240,0.03);
          box-shadow: 0 8px 20px rgba(2,6,23,0.45);
        }

        .user-name {
          font-weight:600;
          color: var(--cream-50);
        }

        .user-sub {
          font-size: 12px;
          color: rgba(255,250,240,0.72);
        }

        .chat-btn {
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          color: #041f2d;
          padding:8px 12px;
          border-radius:10px;
          border: none;
          font-weight:700;
          cursor:pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }

        .chat-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(45,212,191,0.12); }

        .close-floating {
          background: rgba(255,250,240,0.04);
          border: 1px solid rgba(255,250,240,0.06);
          color: var(--cream-50);
          padding:6px 10px;
          border-radius:8px;
          cursor:pointer;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(2,6,23,0.6);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:50;
        }
        .modal-card {
          width: 95%;
          max-width: 920px;
          background: linear-gradient(180deg, rgba(255,250,240,0.02), rgba(255,250,240,0.01));
          border: 1px solid var(--card-border);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(2,6,23,0.7);
          overflow: hidden;
        }
        .modal-header {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:14px 18px;
          border-bottom: 1px solid rgba(255,250,240,0.03);
        }
        .modal-title { font-weight:700; color:var(--cream-50); }
        .modal-sub { font-size:12px; color: rgba(255,250,240,0.72); }

        @media (max-width:640px) {
          .panel { padding: 12px; }
          .user-item { padding: 10px; }
        }
      `}</style>

      <div className="panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              className="close-floating"
              onClick={() => navigate("/")}
              aria-label="Close connected users"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {connectedUsers.length === 0 ? (
            <div style={{ color: "rgba(255,250,240,0.7)", padding: 18, borderRadius: 10, background: "rgba(255,250,240,0.02)" }}>
              No connections found. Try connecting with other users to start a conversation.
            </div>
          ) : (
            connectedUsers.map((user) => (
              <div key={user._id} className="user-item" role="button" tabIndex={0}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 10, display: "flex", alignItems: "center",
                    justifyContent: "center", background: "rgba(45,212,191,0.08)", color: "var(--mint-600)", fontWeight: 800
                  }}>
                    {user.username ? user.username.slice(0,1).toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="user-name">{user.username}</div>
                    <div className="user-sub">{user.email || "Member"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => setSelectedChatUser(user)}
                    className="chat-btn"
                    aria-label={`Open chat with ${user.username}`}
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Chat */}
      {selectedChatUser && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <div className="modal-title">{selectedChatUser.username}</div>
                <div className="modal-sub">Chat with {selectedChatUser.username}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  className="close-floating"
                  onClick={() => setSelectedChatUser(null)}
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ padding: 16 }}>
              {/* Chat component receives IDs (current user and selected) */}
              <Chat currentUserId={currentUserId} connectedUserId={selectedChatUser._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedUsers;
