// SendConnectRequestButton.js
import React, { useState } from "react";
import API_URL from '../api';
import axios from "axios";

const SendConnectRequestButton = ({ receiverId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState(null); // {type:'success'|'error', text}

  const handleSendRequest = async () => {
    if (loading || sent) return;

    const senderId = localStorage.getItem("id"); // unified with your other components
    if (!senderId) {
      setMessage({ type: "error", text: "You must be logged in to send requests." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/api/connection/send-request`, {
        senderId,
        receiverId,
      });

      setSent(true);
      setMessage({ type: "success", text: response.data?.message || "Request Sent" });

      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      const msg = err?.response?.data?.message || "Error sending connection request.";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --cream-50: #fffaf0;
        }

        .send-btn {
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          color: #041f2d;
          padding: 8px 14px;
          border-radius: 10px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .send-btn:hover:not([disabled]) {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(45,212,191,0.12);
        }
        .send-btn[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sent-pill {
          background: rgba(45,212,191,0.12);
          color: var(--mint-500);
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 700;
          text-align: center;
        }

        .msg-success {
          color: #9be7cf;
          font-size: 13px;
        }
        .msg-error {
          color: #ffb4b4;
          font-size: 13px;
        }
      `}</style>

      {/* Button or Sent status */}
      {sent ? (
        <div className="sent-pill">Request Sent</div>
      ) : (
        <button
          className="send-btn"
          disabled={loading}
          onClick={handleSendRequest}
        >
          {loading ? "Sending..." : "Connect"}
        </button>
      )}

      {/* Message */}
      {message && (
        <div className={message.type === "success" ? "msg-success" : "msg-error"}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default SendConnectRequestButton;
