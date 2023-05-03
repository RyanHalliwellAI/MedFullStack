import React, { useState } from 'react';

function SymptomInput() 
{
    const [symptoms, setSymptoms] = useState('');
    const [output, setOutput] = useState('');

    const handleInputChange = (e) => {
        setSymptoms(e.target.value);
    };
    const handleButtonClick = async () => {
        // Send symptoms to the backend
        try {
            const response = await fetch('http://127.0.0.1:5000/process_symptoms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symptoms }),
            });
            
            const data = await response.json();
            setOutput(data.result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Enter Your Symptoms</h2>
            <textarea 
                value={symptoms}
                onChange={handleInputChange}
                placeholder="Describe your symptoms here"
                rows="4"
                cols="50"
            />
            <br />
            <button className="btn btn-primary mt-2" onClick={handleButtonClick}>
                Submit Symptoms
            </button>
            {output && (
                <div className="mt-3">
                    <h3>Your Symptoms:</h3>
                    <textarea 
                        value={output}
                        readOnly
                        rows="4"
                        cols="50"
                    />
                </div>
            )}
        </div>
    );
}

export default SymptomInput;

