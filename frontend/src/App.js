import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Profile from './components/Profile';
import Home from './components/Home';
import EditProfile from './components/EditProfile';
import ProfileTemplates from './components/ProfileTemplates';
import SearchSkills from './components/SearchSkills';
import PendingRequests from './components/PendingRequest';
import ConnectedUsers from './components/ConnectedUsers';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for login status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // or wherever you store your token
    setIsLoggedIn(!!token); // Set logged in state based on token presence
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token on logout
    setIsLoggedIn(false); // Update state
  };

  const currentUserId = localStorage.getItem('id') || ''; // Default to an empty string if not found

  return (
    <Router>
      {/* <Navbar isLoggedIn={isLoggedIn}/> */}
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogout={handleLogout}/>}/>
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/profile" element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/profile-templates" element={isLoggedIn ? <ProfileTemplates userId={currentUserId} /> : <Navigate to="/login" />} />
        <Route path="/search-skills" element={isLoggedIn ? <SearchSkills /> : <Navigate to="/login" />} />
        <Route path="/request" element={isLoggedIn ? <PendingRequests currentUserId={currentUserId} /> : <Navigate to="/login" />} />
        <Route path="/chat" element={<ConnectedUsers currentUserId={currentUserId} />} />
      </Routes>
    </Router>
  );
};

export default App;
