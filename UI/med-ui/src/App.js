import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  //setting uop all the constants
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [passwordHash, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // preventing default event listener
  const handleSubmit = async (e) => {
    e.preventDefault();

  //Adding API reques to create account
  const response = await fetch('http://localhost:5041/api/account/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, passwordHash }),
    });
    const result = await response.text();
    setMessage(result);
  };


  return (
    <div className="App container">
      <h3 className = "d-flex justify-content-center m-3">
        Create Account
      </h3>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label for="username">Username</label>
            <input 
            type="text" 
            className="form-control" 
            id="username" 
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
             />
          </div>
          <div className="form-group">
            <label for="email">Email address</label>
            <input 
            type="email" 
            className="form-control" 
            id="email" 
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             />
          </div>
          <div className="form-group">
            <label for="passwordHash">Password</label>
            <input 
            type="password" 
            className="form-control" 
            id="passwordHash" 
            placeholder="PasswordHash"
            value={passwordHash}
            onChange={(e) => setPassword(e.target.value)}
             />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        {message && <p>{message}</p>}

      </div>
    </div>
  );
}

export default App;
