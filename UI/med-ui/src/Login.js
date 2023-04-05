import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function Login() {
    const [email, setEmail] = useState('');
    const [passwordHash, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5041/api/account/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, passwordHash }),
          });
          const result = await response.text();
          setMessage(result);
        };


  return (
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">Login</h3>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="passwordHash"
              placeholder="passwordHash"
              value={passwordHash}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Login;