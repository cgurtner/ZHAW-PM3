# ZHAW-PM3
This repository contains the code for the `Software Projects 3 (PM3)` course at the Zurich University of Applied Sciences.

## Team

This Lab is an effort of Micheal Seitz (seitzmi1) and Cyrill Gurtner (gurtncyr).

## Presentation

Our final LNW3 presentation is saved in `ppt/31215_ln3-presentation.pptx`.

## Services

| URL | Name | Description |
| :-------- | :--- | :-------------|
| http://localhost:5000/api/ | api | Python Flask API |
| http://localhost:3000 | frontend | React Next.js Frontend |
| mongodb://mongodb:27017/ | mongodb | MongoDB |

## Setup

### Import
Before the app can be used, the data needs to be imported. Execute `docker-compose up importer`. The data file `importer/data/osm-output.json` is automatically downloaded if it doesn't exist.

If the import already was done and a db with amenities is present, this output will be visible in the docker log:
```
zhaw-pm3-importer-1  | ============================= DATA READY =============================
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | There are already 22283 amenities imported! 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | ============================= DATA READY =============================
```

If a new import is needed, it will print the rows that are processed. At the end the docker log will output:
```
zhaw-pm3-importer-1  | ============================= DATA READY =============================
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | There are 22283 entries ready for import...
zhaw-pm3-importer-1  | There were 211545 entries removed...
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | Importing into amenities collection now...
zhaw-pm3-importer-1  | Import finished! 22283 amenities imported.
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | 
zhaw-pm3-importer-1  | ============================= DATA READY =============================
```

### Project
After the import is done and the `zhaw-pm3-importer-1` exits, start the whole composition:\
\
`docker-compose up`

## MongoDB
Connect to the database via terminal with `docker exec -it zhaw-pm3-mongodb-1 mongosh osm`.\
Count all amenities with `db.amenities.find()`.
