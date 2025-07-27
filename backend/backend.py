from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for the parse-ocr endpoint
CORS(app, resources={r"/parse-ocr": {"origins": "*"}}, supports_credentials=True)

@app.route('/parse-ocr', methods=['POST'])
def parse_ocr():
    ocr_data = request.json.get('ocrText', '')
    # Process OCR data (example: extract numbers)
    parsed_data = {"numbers": [int(s) for s in ocr_data.split() if s.isdigit()]}
    print(parsed_data)
    return jsonify(parsed_data)

if __name__ == '__main__':
    # Bind to all interfaces so web client can reach this server
    app.run(debug=True, host='0.0.0.0', port=5001)