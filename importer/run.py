import json
import os
import copy
from pymongo import MongoClient
from helper import cast, delField, compare

# MongoDB connection string
mongo_uri = "mongodb://mongodb:27017/"
client = MongoClient(mongo_uri)

filepath = os.path.join(os.getcwd(), 'data/osm-output.json')

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
    cleaned_rows.append(entry)

print('There are {} entries ready for import!'.format(len(cleaned_rows)))
print('There were {} entries removed!'.format(len(removed_rows)))

db = client.get_database('pm3')
