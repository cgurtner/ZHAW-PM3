import json
import os
import copy
import urllib.request
from pymongo import MongoClient
from helpers import cast, del_field, add_http, get_address

amenities_to_import = ['restaurant', 'cafe', 'fast_food', 'biergarten', 'bar', 'pub', 'nightclub']

# MongoDB connection string
mongo_uri = 'mongodb://mongodb:27017/'
client = MongoClient(mongo_uri)

db = client.get_database('osm')
collection = db.get_collection('amenities')
restaurant_count = collection.count_documents({})
if restaurant_count == 22283:
    print('============================= DATA READY =============================')
    print('\n\n\nThere are already {} amenities imported! \n\n\n'.format(restaurant_count))
    print('============================= DATA READY =============================')
    client.close()
    exit()

fileurl = 'http://cgurtner.ch/data/osm-output.json'
filepath = os.path.join(os.getcwd(), 'data/osm-output.json')

if not os.path.exists(filepath):
    print('Downloading data-file from ' + fileurl)
    urllib.request.urlretrieve(fileurl, filepath)

with open(filepath, 'r') as file:
    osm = json.load(file)

cleaned_rows, removed_rows = [], []
for entry in osm['nodes']:
    # we don't want to alter the original entry in osm['nodes'] for further comparions and tests
    entry = copy.deepcopy(entry)

    # change all keys to lowercase
    entry = {k.lower(): v for k, v in entry.items()}

    if entry['amenity'] not in amenities_to_import:
        removed_rows.append(entry)
        continue

    # rows with fixme attribute should be removed
    # fixme is used to mark rows with errors or wrong data
    if 'fixme' in entry:
        removed_rows.append(entry)
        continue

    # Remove rows with no name, we can't use them for our tool.
    if 'name' not in entry:
        removed_rows.append(entry)
        continue

    # Add fields for consistency
    if 'cuisine' not in entry:
        entry['cuisine'] = None
    
    if 'phone' not in entry:
        entry['phone'] = None

    if 'email' not in entry:
        entry['email'] = None

    if 'opening_hours' not in entry:
        entry['opening_hours'] = None

    # rows have more than one attribute to indicate a website
    # "website":
    # "contact:website":
    # "url":
    # according to the wiki, the priority is "website":, "contact:website":, "url":
    # "url": is the most open tag: https://wiki.openstreetmap.org/wiki/Key:url
    # therefore we save in that order, which is available in "website":
    website = None
    if 'website' in entry:
        website = add_http(entry['website'])
    elif 'contact:website' in entry:
        website = add_http(entry['contact:website'])
    elif 'url' in entry:
        website = add_http(entry['url'])

    entry = del_field('contact:website', entry)
    entry = del_field('url', entry)

    entry['website'] = website

    # clean address
    # check if addr:city, addr:street, addr:housenumber, addr:postcode exist
    # if yes, use them
    # if no, fetch address with lat, lon
    entry['address'] = get_address(entry)

    # datatype casts
    entry = cast('id', 'int', entry)
    entry = cast('lat', 'float', entry)
    entry = cast('lon', 'float', entry)

    # include geospatial field
    entry['location'] = {"type": 'Point', "coordinates": [entry['lon'], entry['lat']]}
    cleaned_rows.append(entry)
    print(entry)

print('============================= DATA READY =============================')
print('\n\n\nThere are {} entries ready for import...'.format(len(cleaned_rows)))
print('There were {} entries removed...'.format(len(removed_rows)) + '\n')

print('Importing into amenities collection now...')

collection.delete_many({})
collection.insert_many(cleaned_rows)
collection.create_index([('location', '2dsphere')])

print('Import finished! {} amenities imported.\n\n\n'.format(
    collection.count_documents({}))
)
print('============================= DATA READY =============================')
