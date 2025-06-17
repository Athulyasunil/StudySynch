from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from your frontend

@app.route('/auth', methods=['POST'])
def handle_auth():
    print("Received request at /auth")
    data = request.json
    uid = data.get('uid')
    email = data.get('email')  # if you're also sending email

    if not uid:
        return jsonify({'error': 'UID not provided'}), 400

    # For now, just log or return back
    print(f"Received UID: {uid} and Email: {email}")
    return jsonify({'message': 'UID received', 'uid': uid, 'email': email}), 200

if __name__ == '__main__':
    app.run(debug=True)
