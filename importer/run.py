import json
import os
import copy
import urllib.request
from pymongo import MongoClient
from helper import cast, delField, compare

# MongoDB connection string
mongo_uri = 'mongodb://mongodb:27017/'
client = MongoClient(mongo_uri)

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

    # rows with fixme attribute should be removed
    # fixme is used to mark rows with errors or wrong data
    # https://wiki.openstreetmap.org/wiki/Key:fixme
    # test row: 257085086, 267053813, 271846258
    if 'fixme' in entry:
        removed_rows.append(entry)
        continue

    # rows have more than one attribute to indicate a website
    # "website":
    # "contact:website":
    # "url":
    # according to the wiki, the priority is "website":, "contact:website":, "url":
    # "url": is the most open tag: https://wiki.openstreetmap.org/wiki/Key:url
    # therefore we save in that order, which is available in "website":
    # test 1: 1014954, has url and website => url should be removed, website should stay the same
    # test 2: 3020881761, has website and contact:website => website should be taken, contact:website removed
    # test 3: 298715804, has only url => should be changed to website:
    website = False
    if 'website' in entry:
        website = entry['website']
    elif 'contact:website' in entry:
        website = entry['contact:website']
    elif 'url' in entry:
        website = entry['url']

    entry = delField('contact:website', entry)
    entry = delField('url', entry)

    entry['website'] = website

    # datatype casts
    entry = cast('id', 'int', entry)
    entry = cast('lat', 'float', entry)
    entry = cast('lon', 'float', entry)

    # include geospatial field
    entry['location'] = {
        "type": 'Point',
        "coordinates": [entry['lon'], entry['lat']]
    }

    cleaned_rows.append(entry)

print('There are {} entries ready for import...'.format(len(cleaned_rows)))
print('There were {} entries removed...'.format(len(removed_rows)) + '\n')

print('Importing into amenities collection now...')

db = client.get_database('osm')
collection = db.get_collection('amenities')

collection.delete_many({})
collection.insert_many(cleaned_rows)

# add indexes
collection.create_index([('location', '2dsphere')])

print('Import finished! {} rows imported.'.format(
    collection.count_documents({})))
