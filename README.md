# ZHAW-PM3
This repository contains the code for the `Software Projects 3 (PM3)` course at the Zurich University of Applied Sciences.

## Services

| URL | Name | Description |
| :-------- |:---| :-------------|
| http://localhost:5000/api/ | api | Python Flask API |
| http://localhost:3000 | frontend | React Next.js Frontend |
| mongodb://mongodb:27017/ | mongodb | MongoDB |

## Setup

Start the docker-composition from git-repository root with `docker-compose up`. This will start all services and run the `importer/run.py` script to import the amenities.

### Connect to mongoDB

`docker exec -it zhaw-pm3-mongodb-1 mongosh osm`  this will connect you to the db. `db.amenities.find()` will select all imported amenities.

### Importer

On startup, the `run.py` imports the amenities from `data/osm-output.json`. To re-run the script start and run bash inside the container `docker-compose run importer bash` and run `python run.py`. The collection `db.amenities` is always emptied before re-import.
