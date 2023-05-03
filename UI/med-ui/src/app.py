from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
def check_symptoms(symptoms):
    symptoms = symptoms.lower()
    
    if "fever" in symptoms and "cough" in symptoms and "fatigue" in symptoms:
        return "You may have the flu."
    elif "sneezing" in symptoms and "itchy eyes" in symptoms and "runny nose" in symptoms:
        return "You may have allergies."
    elif "fever" in symptoms and "dry cough" in symptoms and "loss of taste" in symptoms:
        return "You may have COVID-19."
    elif "sore throat" in symptoms and "runny nose" in symptoms and "mild fever" in symptoms:
        return "You may have a common cold."
    else:
        return "Your symptoms are not recognized. Please consult a doctor."

@app.route('/process_symptoms', methods=['POST'])
def process_symptoms():
    data = request.json
    symptoms = data.get('symptoms')

    result = check_symptoms(symptoms)
    
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
