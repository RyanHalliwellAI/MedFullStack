import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export class Admin extends Component
{
    constructor(props){
        super(props);
        this.state={
            doctor:"",
            doctorID:0, 
            modalTitle:"",
            hospital:"IT",
            paintentName: "",
            patientID: 0
    }
}
}
function Home() {
    const [message, setMessage] = useState('Welcome!');
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();


    //gets login from local storage
    useEffect(() => {
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole');
      if (userEmail) {
        setMessage(`Logged in as ${userEmail}`);
        setUserRole(userRole);
      }
    }, [navigate]);

    //handling the logout logic.
    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole'); 
        navigate('/login');
      };



    <h1>Home Page</h1>
    return (
        <div className="App container">
            <h3 className="d-flex justify-content-center m-3">Home</h3>
            <div className="d-flex justify-content-center">
                <p>{message}{userRole}</p>
            </div>
            {userRole === 'admin' && 
            <div>
            <h1 className="d-flex justify-content-center m-3">Admin Dashboard</h1>
            <h2>Create Appointments</h2>
                
                
                
                </div>
            
            
            }
            {userRole === 'user' && 
            <div>
            <h1 className="d-flex justify-content-center m-3">Default Dashboard</h1>
            <h2>Choose Appointment</h2>
            </div>
            }

            <div className="d-flex justify-content-center">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Home;
