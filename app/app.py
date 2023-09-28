from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/search/<id>')
def search(id):
    return 'You are searching: ' + id

@app.route('/api/users')
def users():
    return {
            "users": [
            {
                "name": "John",
                "surname": "Doe",
                "age": 30
            },
            {
                "name": "Jane",
                "surname": "Smith",
                "age": 25
            },
            {
                "name": "Mike",
                "surname": "Jordan",
                "age": 55
            },
            {
                "name": "Alice",
                "surname": "Johnson",
                "age": 35
            }
        ]
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)