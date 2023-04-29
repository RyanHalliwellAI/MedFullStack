import React, { useEffect, useState } from 'react';

function SelectAppointment() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Fetch appointments from API
        fetch('http://localhost:5041/api/account/appointment')
            .then(response => response.json())
            .then(data => {
                setAppointments(data);
            });
    }, []);

    const bookAppointment = (appointmentId) => {
        // Implement booking logic here
        alert(`Booking appointment ID: ${appointmentId}`);
    };

    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Appointment ID</th>
                        <th>Doctor</th>
                        <th>Patient Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(app => (
                        <tr key={app.appointmentId}>
                            <td>{app.appointmentId}</td>
                            <td>{app.doctor}</td>
                            <td>{app.patientName}</td>
                            <td>{app.description}</td>
                            <td>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => bookAppointment(app.appointmentId)}>
                                    Book
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SelectAppointment;
