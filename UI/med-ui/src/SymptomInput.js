import React, { useState } from 'react';
import Select from 'react-select';

const commonSymptoms = [
  { value: 'headache', label: 'Headache' },
  { value: 'fever', label: 'Fever' },
  { value: 'cough', label: 'Cough' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'sore_throat', label: 'Sore Throat' },
  { value: 'runny_nose', label: 'Runny Nose' },
  { value: 'muscle_ache', label: 'Muscle Ache' },
  { value: 'nausea', label: 'Nausea' },
  // Add more symptoms as needed
];

function SymptomInput() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [output, setOutput] = useState('');

  const handleSymptomChange = (selectedOptions) => {
    setSelectedSymptoms(selectedOptions);
  };

  const handleButtonClick = async () => {
    try {
      const symptoms = selectedSymptoms.map(option => option.value).join(', ');
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
      <h2>Select Your Symptoms</h2>
      <Select
        isMulti
        name="symptoms"
        options={commonSymptoms}
        className="basic-multi-select"
        classNamePrefix="select"
        value={selectedSymptoms}
        onChange={handleSymptomChange}
        placeholder="Select your symptoms"
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