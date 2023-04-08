// src/App.js
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import Login from './Login';
import Home from './HomePage';

function App() {
 return (
    <div>
      <nav>
        <Link to="/">Create Account</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
