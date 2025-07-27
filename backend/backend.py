from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8081"}})

@app.route('/parse-ocr', methods=['POST'])
def parse_ocr():
    ocr_data = request.json.get('ocrText', '')
    # Process OCR data (example: extract numbers)
    parsed_data = {"numbers": [int(s) for s in ocr_data.split() if s.isdigit()]}
    print(parsed_data)
    return jsonify(parsed_data)

if __name__ == '__main__':
    app.run(debug=True)