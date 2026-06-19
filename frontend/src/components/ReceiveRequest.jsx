// AcceptRejectRequestButton.js
import React, { useState } from "react";
import API_URL from '../api';
import axios from "axios";

const AcceptRejectRequestButton = ({ senderId, receiverId, currentStatus = "pending", refreshList }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateStatus = async (newStatus) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/connection/update-status`, {
        senderId,
        receiverId,
        status: newStatus,
      });

      setStatus(newStatus);
      // optionally refresh parent list (if provided)
      if (typeof refreshList === "function") {
        try { refreshList(); } catch (_) { /* ignore refresh errors */ }
      }

      // small user-friendly feedback (you can replace alert with a nicer toast later)
      alert(response.data?.message || `Request ${newStatus}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Error updating status.";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* Inline theme CSS (keeps component self-contained) */}
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --cream-50: #fffaf0;
          --card-border: rgba(255,250,240,0.06);
        }
        .ar-btn {
          padding: 8px 12px;
          border-radius: 10px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .ar-accept {
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          color: #041f2d;
        }
        .ar-reject {
          background: rgba(255,255,255,0.06);
          color: var(--cream-50);
          border: 1px solid var(--card-border);
        }
        .ar-accept[disabled], .ar-reject[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .status-pill {
          padding: 6px 10px;
          border-radius: 999px;
          font-weight:700;
          font-size: 13px;
        }
        .status-accepted { background: rgba(45,212,191,0.12); color: var(--mint-500); }
        .status-rejected { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); }
        .error-text { color: #ffb4b4; font-size: 13px; margin-left: 6px; }
      `}</style>

      {status === "pending" && (
        <>
          <button
            className="ar-btn ar-accept"
            onClick={() => handleUpdateStatus("accepted")}
            disabled={loading}
            aria-label="Accept request"
            title="Accept request"
          >
            {loading ? "Working..." : "Accept"}
          </button>

          <button
            className="ar-btn ar-reject"
            onClick={() => handleUpdateStatus("rejected")}
            disabled={loading}
            aria-label="Reject request"
            title="Reject request"
          >
            {loading ? "Working..." : "Reject"}
          </button>
        </>
      )}

      {status === "accepted" && (
        <div className="status-pill status-accepted" role="status" aria-live="polite">
          Request Accepted
        </div>
      )}

      {status === "rejected" && (
        <div className="status-pill status-rejected" role="status" aria-live="polite">
          Request Rejected
        </div>
      )}

      {error && <div className="error-text" role="alert">{error}</div>}
    </div>
  );
};

export default AcceptRejectRequestButton;
