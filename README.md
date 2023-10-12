# ZHAW-PM3
This repository holds the code of the software projects 3 course of the Zurich University of Applied Sciences.

## Setup

Start the docker-composition from git-repository root with `docker-compose up`. This will start the mongoDB and Python Flask service. Also it will run the `./importer/run.py` script and import some dummy data into a mongoDB.

### Connect to Frontend

Where is a Next.js frontend running on http://localhost:3000. It is based on React and uses the TailwindCSS (https://tailwindcss.com) styling system.

### Connect to mongoDB

`docker-compose exec -it zhaw-pm3-mongodb-1 mongosh pm3`  this will connect you to the db. `db.users.find()` will show you all imported dummy users.

### Connect to Flask

In your browser, go to http://localhost:5000/static/users.html. This will trigger the `@app.route('/api/users')` in `app.py` and request the users via `GET` and output them through JavaScript DOM manipulation.