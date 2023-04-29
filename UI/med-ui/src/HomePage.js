import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SelectAppointment from './SelectAppointment';


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
    //edit click for updating an appointment
    editClick(app) {
        this.setState({
            modalTitle: "Edit Appointment",
            appointmentId: app.appointmentId,
            doctor: app.doctor,
            hospital: app.hospital,
            patientName: app.patientName,
            description: app.description
        });
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
    //update click the update the records in the databases
    updateClick() {
        fetch('http://localhost:5041/api/Account/appointment/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appointmentId: this.state.appointmentId,
                doctor: this.state.doctor,
                hospital: this.state.hospital,
                patientName: this.state.patientName,
                appointmentDate: new Date().toISOString(), // Keep original date
                description: this.state.description
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert("Updated successfully");
                this.refreshList();
            }, (error) => {
                alert('Failed: ' + error.message);
            });
    }
    //delete specififc appointment id
    deleteClick(id) {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            fetch('http://localhost:5041/api/Account/appointment/delete/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.text()) 
            .then((result) => {
                alert(result); 
                this.refreshList();
            }, (error) => {
                alert('Failed: ' + error.message);
            });
        }
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
                        <th>Actions</th>
                    </tr>
                </thead>
                        <tbody>
                        {appointments.map(app =>
                            <tr key={app.appointmentId}>
                                <td>{app.appointmentId}</td>
                                <td>{app.doctor}</td>
                                <td>{app.patientName}</td>
                                <td>{app.description}</td>
                                <td>
                                <button type="button"
                                        className="btn btn-light mr-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => this.editClick(app)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </button>
                                    <button type="button"
                                    className="btn btn-light mr-1"
                                    onClick={() => this.deleteClick(app.appointmentId)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                    </svg>
                                </button>
                                </td>
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
                                        :                                     
                                        <button type="button"
                                            className="btn btn-primary float-start"
                                            onClick={() => this.updateClick()}>
                                            Update
                                        </button>}
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
            {userRole === 'default' && 
            <div>
            <h1 className="d-flex justify-content-center m-3">Default Dashboard</h1>
            <h2>Choose Appointment</h2>
            <SelectAppointment />

            </div>
            }

            <div className="d-flex justify-content-center">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Home;
