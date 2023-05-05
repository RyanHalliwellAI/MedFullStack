from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
def check_symptoms(symptoms):  
    symptom_set = set(symptoms)
    
    if {"fever", "cough", "fatigue"}.issubset(symptom_set):
        return "You may have the flu."
    elif {"sneezing", "itchy_eyes", "runny_nose"}.issubset(symptom_set):
        return "You may have allergies."
    elif {"fever", "dry_cough", "loss_of_taste"}.issubset(symptom_set):
        return "You may have COVID-19."
    elif {"sore_throat", "runny_nose", "fever"}.issubset(symptom_set):
        return "You may have a common cold."
    else:
        return "Your symptoms are not recognized. Please consult a doctor."

@app.route('/process_symptoms', methods=['POST'])
def process_symptoms():
    data = request.json
    symptoms = data.get('symptoms', '').split(', ')

    result = check_symptoms(symptoms)
    
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
