from flask import Flask, jsonify, request
from bson.int64 import Int64
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import pytz

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://mongodb:27017/')
db = client.osm

@app.route('/api/add-rating', methods=['POST'])
def add_rating():
    data = request.json
    data['created'] = datetime.utcnow()
    db.ratings.insert_one(data)
    return jsonify({'message': 'Data received successfully'}), 200

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
        if amenity['cuisine'] is not None:
            if amenity['cuisine'] not in resp:
                resp[amenity['cuisine']] = amenity['cuisine']
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
    ratings_cursor = db.ratings.find({'id': Int64(id)}, {'_id': 0})
    ratings = list(ratings_cursor)
    if ratings:
        sums = { "food": 0, "service": 0, "comfort": 0, "location": 0 }
        counts = { "food": 0, "service": 0, "comfort": 0, "location": 0 }
        for rating in ratings:
            for category in sums.keys():
                if category in rating:
                    sums[category] += rating[category]
                    counts[category] += 1
        averages = {category: sums[category] / counts[category] for category in sums if counts[category] > 0}
    resp = {
        "id": amenity['id'], 
        "name": amenity['name'], 
        "website": amenity['website'],
        "address": amenity['address'],
        "phone": amenity['phone'],
        "email": amenity['email'],
        "opening_hours": amenity['opening_hours'],
        "lat": amenity['lat'], 
        "lon": amenity['lon'],
        "ratings": ratings,
        "averages": averages
    }
    return jsonify(resp)

@app.route('/api/ratings/<id>')
def getRatings(id):
    ratings_cursor = db.ratings.find({'id': Int64(id)}, {'_id': 0}).sort('created', -1)
    ratings = list(ratings_cursor)
    for rating in ratings:
        created = rating['created']
        swiss_tz = pytz.timezone('Europe/Zurich')
        swiss_time = created.replace(tzinfo=pytz.utc).astimezone(swiss_tz)
        rating['created'] = swiss_time.strftime("%d.%m.%Y %H:%M")
    return jsonify(ratings)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
