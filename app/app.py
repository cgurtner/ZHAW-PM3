from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

# mongodb client
client = MongoClient('mongodb://mongodb:27017/')  
db = client.pm3

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/search/<id>')
def search(id):
    return 'You are searching: ' + id

@app.route('/api/users')
def users():
    user_collection = db.users
    users = user_collection.find()
    
    users_list = {'users': [{'name': user['name'], 'surname': user['surname'], 'age': user['age']} for user in users]}
    return users_list

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)