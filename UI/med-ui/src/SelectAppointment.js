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
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            alert('User is not logged in');
            return;
        }

        fetch(`http://localhost:5041/api/Account/appointment/update`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appointmentId: appointmentId,
                patientName: userEmail,
                // Ensure other fields (like doctor, hospital, etc.) are included as needed
                doctor: appointments.find(app => app.appointmentId === appointmentId).doctor,
                hospital: appointments.find(app => app.appointmentId === appointmentId).hospital,
                description: appointments.find(app => app.appointmentId === appointmentId).description,
                appointmentDate: new Date().toISOString() // or use the original date
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Appointment booked successfully!');
                setAppointments(prevAppointments => 
                    prevAppointments.map(app =>
                        app.appointmentId === appointmentId 
                        ? { ...app, patientName: userEmail } 
                        : app
                    )
                );
            } else {
                alert('Failed to book the appointment');
            }
        })
        .catch(error => {
            console.error('Error booking appointment:', error);
            alert('An error occurred while booking the appointment');
        });
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
