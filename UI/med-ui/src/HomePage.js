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
            patientName: "",
            description: ""
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            console.log("State updated:", this.state);
        }
    }

    changeDoctor = (e) => {
        this.setState({ doctor: e.target.value });
    }

    changeDescription = (e) => {
        this.setState({ description: e.target.value });
    }

    changeHospital = (e) => {
        this.setState({ hospital: e.target.value });
    }

    changePatientName = (e) => {
        this.setState({ patientName: e.target.value });
    }
    addClick() {
        console.log("Test")
        this.setState({
            modalTitle: "Add Appointment",
            appointmentId: 0,
            doctor: "",
            hospital: "",
            patientName: "",
            description: ""
        });
        console.log("addClick method run, state updated:", this.state);

    }
//create appointment and send to sql
    createClick() {
        fetch('http://localhost:5041/api/Account/appointment/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                doctor: this.state.doctor,
                patientName: this.state.patientName,
                appointmentDate: new Date().toISOString(),
                description: this.state.description,

            })
        })
            .then(res => res.json())
            .then((result) => {
                alert("Created");
                this.refreshList();
            }, (error) => {
                alert('Failed' + error.message);
            });
    }
    render() {
        const { appointments, modalTitle, appointmentId, doctor, hospital, patientName, description } = this.state;
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
                        <th>Patient Name</th>
                        <th>Description</th>

                    </tr>
                </thead>
                        <tbody>
                        {appointments.map(app =>
                            <tr key={app.appointmentId}>
                                <td>{app.appointmentId}</td>
                                <td>{app.doctor}</td>
                                <td>{app.patientName}</td>
                                <td>{app.description}</td>
                                </tr>
                        )}
                        </tbody>
            </table>
            {/* popup for adding appointment */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Doctor</span>
                                        <input type="text" className="form-control"
                                            value={doctor}
                                            onChange={this.changeDoctor} />
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Hospital</span>
                                        <input type="text" className="form-control"
                                            value={hospital}
                                            onChange={this.changeHospital} />
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Patient Name</span>
                                        <input type="text" className="form-control"
                                            value={patientName}
                                            onChange={this.changePatientName} />
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Description</span>
                                        <input type="text" className="form-control"
                                            value={description}
                                            onChange={this.changeDescription} />
                                    </div>
                                    {appointmentId === 0 ?
                                        <button type="button"
                                            className="btn btn-primary float-start"
                                            onClick={() => this.createClick()}>
                                            Create
                                        </button>
                                        : null}
                        </div>

                    </div>
                </div>
            </div>

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
            <Admin />

                
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
