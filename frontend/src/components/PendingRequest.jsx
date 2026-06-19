import React, { useState, useEffect , useCallback} from "react";
import API_URL from '../api';
import axios from "axios";
import AcceptRejectRequestButton from "./ReceiveRequest";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/usericon.png";

const PendingRequests = ({ currentUserId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // eslint-disable-next-line
  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/connection/pending-requests/${currentUserId}`
      );
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching pending requests", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) fetchPendingRequests();
  }, [currentUserId, fetchPendingRequests]);

  return (
    <div className="min-h-screen pending-page p-6">
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

        .pending-page {
          background: linear-gradient(180deg, var(--navy-900) 0%, var(--navy-950) 100%);
          color: var(--cream-50);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .panel {
          width: 100%;
          max-width: 920px;
          background: linear-gradient(180deg, rgba(255,250,240,0.02), rgba(255,250,240,0.01));
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.6);
        }

        .list-item {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:12px 14px;
          border-radius:10px;
          background: rgba(255,250,240,0.02);
          border: 1px solid rgba(255,250,240,0.02);
          transition: transform 0.14s ease, background 0.14s ease, box-shadow 0.14s ease;
        }

        .list-item:hover {
          transform: translateY(-4px);
          background: rgba(255,250,240,0.03);
          box-shadow: 0 8px 20px rgba(2,6,23,0.45);
        }

        .user-thumb {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          overflow: hidden;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(45,212,191,0.06);
          border: 1px solid rgba(255,250,240,0.03);
        }

        .user-name {
          color: var(--cream-50);
          font-weight:700;
        }
        .user-sub { color: rgba(255,250,240,0.72); font-size: 13px; }

        .btn-refresh {
          background: transparent;
          color: var(--mint-500);
          border: 1px solid rgba(45,212,191,0.12);
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
        }
        .btn-refresh:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(45,212,191,0.08); }

        .empty {
          padding: 28px;
          border-radius: 10px;
          background: rgba(255,250,240,0.02);
          text-align:center;
          color: rgba(255,250,240,0.7);
        }

        @media (max-width: 640px) {
          .panel { padding: 12px; }
          .list-item { padding: 10px; gap:10px; }
        }
      `}</style>

      <div className="panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--mint-500)" }}>
              Pending Connection Requests
            </h2>
            <div style={{ color: "var(--cream-50)", opacity: 0.85, marginTop: 6 }}>
              Review and respond to requests from other users
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-refresh" onClick={fetchPendingRequests} aria-label="Refresh list">
              Refresh
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn-refresh"
              aria-label="Close pending requests"
            >
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty">Loading pending requests…</div>
        ) : requests.length === 0 ? (
          <div className="empty">No pending requests.</div>
        ) : (
          <ul className="grid gap-3">
            {requests.map((request) => (
              <li key={request._id} className="list-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="user-thumb" aria-hidden>
                    <img
                      src={request.sender?.avatar || profileIcon}
                      alt={request.sender?.username || "User"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div>
                    <div className="user-name">{request.sender?.username || "Unknown"}</div>
                    <div className="user-sub">{request.sender?.email || "Member"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {/* Pass refreshList so the child component can trigger a refresh after accept/reject */}
                  <AcceptRejectRequestButton
                    senderId={request.sender._id}
                    receiverId={currentUserId}
                    currentStatus={request.status}
                    refreshList={fetchPendingRequests}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;
