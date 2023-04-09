import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    const [message, setMessage] = useState('Welcome!');
    const navigate = useNavigate();


    //gets login from local storage
    useEffect(() => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        setMessage(`Logged in as ${userEmail}`);
      }
    }, []);

    //handling the logout logic.
    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        navigate('/login');
      };



    <h1>Home Page</h1>
    return (
        <div className="App container">
            <h3 className="d-flex justify-content-center m-3">Home</h3>
            <div className="d-flex justify-content-center">
                <p>{message}</p>
            </div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Home;
