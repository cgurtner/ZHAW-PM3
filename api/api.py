from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://mongodb:27017/')
db = client.osm


@app.route('/api/amenity-types')
def amenities():
    condition = [
        {
            "$group": {
                "_id": "$amenity",
                "count": {"$sum": 1}
            }
        }
    ]

    res = db.amenities.aggregate(condition)
    res = {item['_id']: item['count'] for item in res}

    return res


@app.route('/api/explore/<type>')
def explore(type):
    amenities = list(db.amenities.find({'amenity': type}, {'_id': 0}))
    resp = {}
    for amenity in amenities:
        for key in amenity:
            if key == 'amenity':
                continue
            resp[key] = resp.get(key, 0) + 1
    return resp


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
