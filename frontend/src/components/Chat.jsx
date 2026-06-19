import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import profileIcon from '../assets/usericon.png';

import API_URL from '../api';

// keep socket instance here (same as before)
const socket = io(API_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

const Chat = ({ currentUserId, connectedUserId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // { sender, receiver, content, timestamp, delivered }
  const [connectedUser, setConnectedUser] = useState(null); // profile info of connected user
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const typingEmitTimeoutRef = useRef(null);
  const bottomRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // fetch connected user profile & join room + fetch chat history
  useEffect(() => {
    if (!currentUserId || !connectedUserId) {
      setMessages([]);
      setConnectedUser(null);
      return;
    }

    const room = [currentUserId, connectedUserId].sort().join('_');
    socket.emit('joinRoom', room);

    setLoadingMessages(true);

    // fetch connected user's profile (for display)
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_URL}/api/users/profile/${connectedUserId}`, { headers });
        setConnectedUser(res.data || { username: connectedUserId, avatar: null });
      } catch (err) {
        // fallback to id if profile not available
        setConnectedUser({ username: connectedUserId, avatar: null });
      }
    };

    // fetch history
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chat/${currentUserId}/${connectedUserId}`);
        // normalize messages (ensure timestamp strings)
        const msgs = (res.data.messages || []).map(m => ({ ...m, timestamp: m.timestamp || new Date().toISOString(), delivered: true }));
        setMessages(msgs);
        // scroll after tiny delay
        setTimeout(() => scrollToBottomSmooth(), 80);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchProfile();
    fetchMessages();

    // listener: incoming message
    const handleReceive = (newMessage) => {
      // message belongs to this conversation?
      if (
        (newMessage.sender === currentUserId && newMessage.receiver === connectedUserId) ||
        (newMessage.sender === connectedUserId && newMessage.receiver === currentUserId)
      ) {
        // if message is from the other user, mark delivered
        const delivered = newMessage.sender === connectedUserId;
        setMessages(prev => [...prev, { ...newMessage, delivered }]);
        setTimeout(() => scrollToBottomSmooth(), 30);
      }
    };

    // listener: typing
    const handleTyping = ({ from }) => {
      if (from === connectedUserId) {
        setIsTyping(true);
        // hide typing after 2.5s of silence
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2500);
      }
    };

    socket.on('receiveMessage', handleReceive);
    socket.on('userTyping', handleTyping);

    return () => {
      socket.off('receiveMessage', handleReceive);
      socket.off('userTyping', handleTyping);
      socket.emit('leaveRoom', room);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (typingEmitTimeoutRef.current) clearTimeout(typingEmitTimeoutRef.current);
    };
  }, [currentUserId, connectedUserId]);

  // auto-scroll to bottom (smooth) when messages change
  useEffect(() => {
    scrollToBottomSmooth();
  }, [messages]);

  // helper to smooth scroll
  const scrollToBottomSmooth = () => {
    if (bottomRef.current) {
      try {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } catch {
        bottomRef.current.scrollIntoView();
      }
    }
  };

  // send typing events with debounce to avoid spam
  const emitTyping = () => {
    if (!currentUserId || !connectedUserId) return;
    socket.emit('typing', { from: currentUserId, to: connectedUserId });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // debounce typing emit: emit immediately and then prevent another emit for 700ms
    if (typingEmitTimeoutRef.current) {
      clearTimeout(typingEmitTimeoutRef.current);
    } else {
      emitTyping();
    }
    typingEmitTimeoutRef.current = setTimeout(() => {
      typingEmitTimeoutRef.current = null;
    }, 700);
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentUserId || !connectedUserId) return;

    const newMessage = {
      sender: currentUserId,
      receiver: connectedUserId,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      // delivered will be set to true when we hear it back from socket/ server
      delivered: false,
    };

    // optimistic update
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    scrollToBottomSmooth();

    try {
      // persist on server
      await axios.put(`${API_URL}/api/chat/update-chat`, {
        user1: currentUserId,
        user2: connectedUserId,
        newMessage,
      });

      // emit for realtime
      socket.emit('sendMessage', newMessage);
      // optionally mark as delivered locally when received back via receiveMessage handler
    } catch (err) {
      console.error('Error sending message:', err);
      // show inline error on the last optimistic message
      setMessages(prev => {
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        if (lastIdx >= 0) {
          copy[lastIdx] = { ...copy[lastIdx], content: `${copy[lastIdx].content} (failed to send)`, failed: true };
        }
        return copy;
      });
    }
  };

  // send on Enter, shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // util: format timestamp nicely
  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  // util: format date header
  const formatDateHeader = (iso) => {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  // grouping messages by date and sender for display
  const groupedMessages = [];
  messages.forEach((m) => {
    const dateKey = new Date(m.timestamp).toDateString();
    if (!groupedMessages.length || groupedMessages[groupedMessages.length - 1].dateKey !== dateKey) {
      groupedMessages.push({ dateKey, dateLabel: formatDateHeader(m.timestamp), groups: [] });
    }
    const day = groupedMessages[groupedMessages.length - 1];
    const lastGroup = day.groups[day.groups.length - 1];
    if (!lastGroup || lastGroup.sender !== m.sender) {
      // start a new sender group
      day.groups.push({ sender: m.sender, avatar: m.sender === currentUserId ? null : (connectedUser?.avatar || null), items: [m] });
    } else {
      lastGroup.items.push(m);
    }
  });

  return (
    <div className="min-h-[480px] chat-page p-6">
      <style>{`
        :root {
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --card-bg: rgba(255,250,240,0.03);
          --card-border: rgba(255,250,240,0.06);
          --muted: rgba(255,250,240,0.65);
        }

        .chat-page {
          background: linear-gradient(180deg, var(--navy-900) 0%, var(--navy-950) 100%);
          color: var(--cream-50);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-wrapper {
          width: 100%;
          max-width: 980px;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 18px;
          padding: 16px;
        }

        .sidebar {
          background: linear-gradient(180deg, rgba(255,250,240,0.02), rgba(255,250,240,0.01));
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 12px;
          height: 640px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.6);
          overflow: auto;
        }

        .sidebar .profile {
          display:flex;
          gap:10px;
          align-items:center;
          margin-bottom:12px;
        }
        .sidebar .avatar {
          width:56px; height:56px; border-radius:10px; overflow:hidden; background: rgba(45,212,191,0.06); display:flex; align-items:center; justify-content:center;
        }
        .sidebar .avatar img { width:100%; height:100%; object-fit:cover; }

        .main {
          background: linear-gradient(180deg, rgba(255,250,240,0.02), rgba(255,250,240,0.01));
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.6);
          display:flex;
          flex-direction:column;
          height: 640px;
        }

        .header {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 6px 4px;
          border-bottom: 1px solid rgba(255,250,240,0.03);
          margin-bottom: 8px;
        }
        .header-left { display:flex; gap:12px; align-items:center; }
        .header .name { font-weight:800; color: var(--mint-500); }
        .header .status { font-size:12px; color: var(--muted); }

        .messages {
          flex:1;
          overflow-y:auto;
          padding: 10px;
          display:flex;
          flex-direction:column;
          gap: 12px;
        }

        .date-divider {
          text-align:center;
          color: var(--muted);
          font-size:12px;
          margin:6px 0;
        }

        .group {
          display:flex;
          gap:10px;
          align-items:flex-end;
        }
        .group .group-avatar {
          width:40px; height:40px; border-radius:8px; overflow:hidden; background: rgba(45,212,191,0.06); flex-shrink:0;
        }
        .group .group-avatar img { width:100%; height:100%; object-fit:cover; }

        .bubbles {
          display:flex; flex-direction:column; gap:8px;
        }

        .bubble {
          max-width: 76%;
          padding: 10px 12px;
          border-radius: 12px;
          line-height:1.2;
          word-break: break-word;
          box-shadow: 0 6px 20px rgba(2,6,23,0.5);
          font-size:14px;
        }
        .bubble.me {
          align-self:flex-end;
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          color: #041f2d;
          border-bottom-right-radius: 4px;
        }
        .bubble.them {
          align-self:flex-start;
          background: rgba(255,255,255,0.94);
          color: #071022;
          border-bottom-left-radius: 4px;
        }

        .bubble .meta { font-size:11px; color: var(--muted); margin-top:6px; text-align:right; }

        .input-area {
          margin-top: 8px;
          display:flex;
          gap:10px;
          align-items:center;
        }
        .chat-input {
          flex:1;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          background: rgba(255,250,240,0.03);
          color: var(--cream-50);
          min-height:48px;
          resize: none;
          outline: none;
        }
        .chat-input:focus { box-shadow: 0 0 0 4px rgba(45,212,191,0.08); border-color: var(--mint-600); }

        .send-btn {
          background: linear-gradient(90deg, var(--mint-600), var(--mint-500));
          color: #041f2d;
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          cursor: pointer;
        }
        .send-btn[disabled] { opacity: 0.6; cursor: not-allowed; }

        .typing {
          font-size: 13px;
          color: var(--muted);
          margin-left: 6px;
          height: 18px;
        }

        /* custom scrollbar */
        .messages::-webkit-scrollbar { width: 10px; }
        .messages::-webkit-scrollbar-thumb { background: rgba(255,250,240,0.06); border-radius: 10px; }
        .messages::-webkit-scrollbar-track { background: transparent; }

        @media (max-width: 900px) {
          .chat-wrapper { grid-template-columns: 1fr; }
          .sidebar { order: 2; height: 340px; }
          .main { order: 1; height: 620px; }
        }
      `}</style>

      <div className="chat-wrapper">
        {/* LEFT SIDEBAR - basic profile and quick info */}
        <aside className="sidebar" aria-label="Conversation details">
          <div className="profile">
            <div className="avatar">
              <img src={connectedUser?.avatar || profileIcon} alt={connectedUser?.username || 'User'} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--mint-500)' }}>{connectedUser?.username || 'No user selected'}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{connectedUser?.email || ''}</div>
            </div>
          </div>

          <div style={{ marginTop: 8, color: 'var(--muted)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Conversation info</div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              Messages are end-to-end within your workspace. Use the chat to arrange sessions or ask quick questions.
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              className="send-btn"
              onClick={() => { /* quick action - go to connected users */ window.location.href = '/connected-users'; }}
              style={{ width: '100%', padding: '10px 12px' }}
            >
              Open Conversations
            </button>
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="main" role="region" aria-live="polite" aria-label="Chat messages">
          <div className="header" role="banner">
            <div className="header-left">
              <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: 'rgba(45,212,191,0.06)' }}>
                <img src={connectedUser?.avatar || profileIcon} alt={connectedUser?.username || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div className="name">{connectedUser?.username || 'Select a user'}</div>
                <div className="status">{connectedUser ? (isTyping ? 'Typing…' : 'Online') : 'No conversation selected'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {connectedUser ? `Chatting with ${connectedUser.username}` : ''}
              </div>
            </div>
          </div>

          {/* messages area */}
          <div className="messages" role="log" aria-live="polite">
            {loadingMessages && (
              <div style={{ color: 'var(--muted)', textAlign: 'center' }}>Loading messages…</div>
            )}

            {groupedMessages.length === 0 && !loadingMessages && (
              <div style={{ textAlign: 'center', color: 'var(--muted)' }}>No messages yet — say hello 👋</div>
            )}

            {groupedMessages.map((day) => (
              <div key={day.dateKey}>
                <div className="date-divider">{day.dateLabel}</div>

                {day.groups.map((g, gi) => {
                  const isMe = g.sender === currentUserId;
                  return (
                    <div className="group" key={`${day.dateKey}-${gi}`} style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      {!isMe && (
                        <div className="group-avatar" aria-hidden>
                          <img src={connectedUser?.avatar || profileIcon} alt="" />
                        </div>
                      )}

                      <div className="bubbles">
                        {g.items.map((m, mi) => (
                          <div
                            key={`${day.dateKey}-${gi}-${mi}`}
                            className={`bubble ${m.sender === currentUserId ? 'me' : 'them'}`}
                            role="article"
                          >
                            <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                            <div className="meta">
                              {formatTime(m.timestamp)}
                              {m.failed && <span style={{ marginLeft: 8, color: '#ffb4b4' }}>● Failed</span>}
                              {!m.failed && m.delivered && m.sender === currentUserId && <span style={{ marginLeft: 8 }}>● Delivered</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {isMe && (
                        <div className="group-avatar" aria-hidden>
                          <img src={profileIcon} alt="You" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* bottom sentinel to scroll into view */}
            <div ref={bottomRef} />
          </div>

          {/* input */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <textarea
                className="chat-input"
                placeholder={connectedUser ? `Message ${connectedUser.username}…` : 'Select a user to start chatting'}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={2}
                disabled={!connectedUser}
                aria-label="Message input"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!connectedUser || !message.trim()}
                  aria-label="Send message"
                >
                  Send
                </button>
                <div className="typing" aria-live="polite">{isTyping ? `${connectedUser?.username} is typing…` : ''}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
