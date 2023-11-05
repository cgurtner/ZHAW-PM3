import requests, random, re
from urllib.parse import urlencode

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
        address = {"addr:city": "City", "addr:housenumber": "3", "addr:postcode": "1234", "addr:street": "Street"}
        return address
        # lat = entry.get('lat')
        # lon = entry.get('lon')
        # if lat and lon:
        #     fetched_address = fetch_address(lat, lon)
        #     return fetched_address
        # else:
        #     return None

def fetch_address(lat, lon):
    params = {"lat": lat, "lon": lon, "format": "json"}
    print(f"https://nominatim.openstreetmap.org/reverse?{urlencode(params)}")
    response = requests.get(f"https://nominatim.openstreetmap.org/reverse?{urlencode(params)}")
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

def get_random_rating(amenity_id):
    return {
        'id': amenity_id, 
        'name': f'User{random.randint(1, 10000)}',  
        'text': 'Random review text ' + str(random.randint(1, 10000)),
        'food': round(random.uniform(1, 5), 1),
        'service': round(random.uniform(1, 5), 1),
        'comfort': round(random.uniform(1, 5), 1),
        'location': round(random.uniform(1, 5), 1)
    }
