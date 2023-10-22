from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('mongodb://mongodb:27017/')  
db = client.osm

@app.route('/api/amenities/<type>')
def amenities(type):
    amenities = list(db.amenities.find({'amenity': type}, {'_id': 0}))
    return jsonify(amenities)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)