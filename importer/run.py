import json
from pymongo import MongoClient

# MongoDB connection string
mongo_uri = "mongodb://mongodb:27017/"
client = MongoClient(mongo_uri)

db = client.get_database('pm3')
collection = db.get_collection('users')

user_data = [
    {"name": "John", "surname": "Doe", "age": 30},
    {"name": "Jane", "surname": "Smith", "age": 25},
    {"name": "Mike", "surname": "Jordan", "age": 55},
    {"name": "Alice", "surname": "Johnson", "age": 35},
]

collection.insert_many(user_data)
print(f"Inserted {len(user_data)} users into the collection.")