import requests, random, re, json
from datetime import datetime
from urllib.parse import urlencode
from requests.exceptions import ConnectionError
import time

def cast(name, type, entry):
    if type == 'int':
        entry[name] = int(entry[name])
    elif type == 'float':
        entry[name] = float(entry[name])
    return entry        

def del_field(name, entry):
    if name in entry:
        del entry[name]
    return entry

def compare(id, original, cleaned):
    for entry in original:
        if entry['id'] == str(id):
            print(entry)
    for entry in cleaned:
        if entry['id'] == id:
            print(entry)

def add_http(url):
    if url and not re.match(r'^(?:http|https)://', url):
        return 'http://' + url
    return url

def get_address(entry):
    address_fields = ['addr:city', 'addr:housenumber', 'addr:postcode', 'addr:street']
    address = {}
    if all(field in entry for field in address_fields):
        for field in address_fields:
            address[field] = entry[field]
        return address
    else:
        lat = entry.get('lat')
        lon = entry.get('lon')
        if lat and lon:
            fetched_address = fetch_address(lat, lon)
            return fetched_address
        else:
            return None

def fetch_address(lat, lon):
    params = {"lat": lat, "lon": lon, "format": "json"}
    print(f"https://nominatim.openstreetmap.org/reverse?{urlencode(params)}")
    try:
        time.sleep(1.5)
        response = requests.get(f"https://nominatim.openstreetmap.org/reverse?{urlencode(params)}")
    except ConnectionError as e:
        print(f"Connection error occurred: {e}")
        return None
    if response.status_code == 200:
        data = response.json()
        address = data.get('address', {})
        return {
            "addr:city": address.get('city', address.get('town', address.get('village'))),
            "addr:housenumber": address.get('house_number'),
            "addr:postcode": address.get('postcode'),
            "addr:street": address.get('road')
        }
    else:
        return None

def load_reviews():
    with open('data/reviews.json', 'r') as file:
        return json.load(file)

def get_random_review(average_rating, reviews):
    positive_reviews = [review['text'] for review in reviews if review['label'] == 'positive']
    negative_reviews = [review['text'] for review in reviews if review['label'] == 'negative']
    if average_rating > 2.5:
        return random.choice(positive_reviews)
    else:
        return random.choice(negative_reviews)

def get_random_rating(amenity_id):
    ratings = {
        'food': round(random.uniform(1, 5), 1),
        'service': round(random.uniform(1, 5), 1),
        'comfort': round(random.uniform(1, 5), 1),
        'location': round(random.uniform(1, 5), 1),
        'price': round(random.uniform(1, 5), 1)
    }
    average_rating = sum(ratings.values()) / len(ratings)
    reviews = load_reviews()
    review_text = get_random_review(average_rating, reviews)

    return {
        'id': amenity_id, 
        'name': f'User{random.randint(1, 10000)}',  
        'text': review_text,
        **ratings,
        'created': datetime.utcnow()
    }

def parse_cuisine_list(amenity):
    cuisine = []
    if 'cuisine' in amenity and isinstance(amenity['cuisine'], str):
        items = amenity['cuisine'].split(';')
        cuisine = [item.capitalize() for item in items]
    return cuisine
