from flask import Flask, jsonify, request
from bson.int64 import Int64
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

@app.route('/api/explore/attributes/<type>')
def explore(type):
    amenities = list(db.amenities.find({'amenity': type}, {'_id': 0}))
    resp = {}
    for amenity in amenities:
        for key in amenity:
            if key == 'amenity':
                continue
            resp[key] = resp.get(key, 0) + 1
    return resp

@app.route('/api/nearby', methods=['GET'])
def nearby():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    types = request.args.get('types').split(',')
    distance_meters = float(request.args.get('distance'))

    pipeline = [
        {
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "distanceField": "distance",
                "maxDistance": distance_meters,
                "spherical": True,
                "query": {
                    "amenity": {"$in": types}
                }
            }
        }
    ]

    nearby_amenities = list(db.amenities.aggregate(pipeline))
    result = [{"id": amenity['id'], "name": amenity['name'], "type": amenity['amenity'], "cuisine": amenity['cuisine'],
               "distance": amenity['distance'], "lat": amenity['lat'], "lon": amenity['lon']} for amenity in nearby_amenities]

    return jsonify(result)

@app.route('/api/amenity/<id>')
def getAmenity(id):
    amenity = db.amenities.find_one({'id': Int64(id)})
    return {
        "id": amenity['id'], 
        "name": amenity['name'], 
        "website": amenity['website'],
        "address": amenity['address'],
        "phone": amenity['phone'],
        "email": amenity['email'],
        "lat": amenity['lat'], 
        "lon": amenity['lon']
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
