import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    const [message, setMessage] = useState('Welcome!');

    useEffect(() => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        setMessage(`Logged in as ${userEmail}`);
      }
    }, []);



    <h1>Test</h1>
    return (
        <div className="App container">
            <h3 className="d-flex justify-content-center m-3">Home</h3>
            <div className="d-flex justify-content-center">
                <p>{message}</p>
            </div>
        </div>
    );
}

export default Home;
