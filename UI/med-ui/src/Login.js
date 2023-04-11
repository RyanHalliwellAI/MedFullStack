import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function Login() {
  //setting up email and password attributes  
  const [email, setEmail] = useState('');
    const [passwordHash, setPassword] = useState('');
    const [message, setMessage] = useState('');

    //Adding nagivation to home
    const navigate = useNavigate();


    // event listener to fetch from the API and return the result
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5041/api/account/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, passwordHash}),
          });
          const resultText = await response.text();
          console.log(resultText);

          const jsonString = resultText.match(/\{.*\}/)[0];
          const result = JSON.parse(jsonString);
          if (response.ok) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', result.role);
            navigate('/home', { state: { message: result } });
        } else {
            setMessage(result);
        }
        };

  //html code to display input for user.
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