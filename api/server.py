from flask import Flask,jsonify,blueprints
from flask_cors import CORS
from ocr_api_on import ocr

app = Flask(__name__)
CORS(app)

app.register_blueprint(ocr)

if __name__ == '__main__':
    app.run(debug=True)