import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export class Admin extends Component
{
    constructor(props){
        super(props);
        this.state={
            appointments: [],
            modalTitle:"",
            appointmentId: 0,
            doctor: "",
            hospital: "",
            patientName: ""
    };  
}
refreshList() {
    // Fetch appointments from API
    fetch('http://localhost:5041/api/account/appointment')
        .then(response => response.json())
        .then(data => {
            this.setState({ appointments: data });
        });
}
componentDidMount() {
    this.refreshList();
}

changeDoctor = (e) => {
    this.setState({ doctor: e.target.value });
}

changeHospital = (e) => {
    this.setState({ hospital: e.target.value });
}

changePatientName = (e) => {
    this.setState({ patientName: e.target.value });
}
addClick() {
    this.setState({
        modalTitle: "Add Appointment",
        appointmentId: 0,
        doctor: "",
        hospital: "",
        patientName: ""
    });
}
//create appointment and send to sql
createClick() {
    fetch('http://localhost:5041/api/account/appointment', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            doctor: this.state.doctor,
            hospital: this.state.hospital,
            patientName: this.state.patientName
        })
    })
        .then(res => res.json())
        .then((result) => {
            alert("Created");
            this.refreshList();
        }, (error) => {
            alert('Failed');
        });
}
render() {
    const { appointments, modalTitle, appointmentId, doctor, hospital, patientName } = this.state;
    return (
        <div>
        <button type="button"
            className="btn btn-primary m-2 float-end"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => this.addClick()}>
            Add Appointment
        </button>
        <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Doctor</th>
                            <th>Hospital</th>
                            <th>Patient Name</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        </tbody>
                        </table>
        </div>
    );

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
