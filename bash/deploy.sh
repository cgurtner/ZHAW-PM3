#!/bin/bash

VERSION="v1.0.0" # tag with this version needs to be created in the repo
REPO_URL="https://github.com/cgurtner/ZHAW-PM3"

FRONTEND_IMAGE_NAME="nearbai-frontend"
API_IMAGE_NAME="nearbai-api"

rm -rf nearbai-$VERSION

git clone --branch $VERSION $REPO_URL nearbai-$VERSION
cd nearbai-$VERSION

cd frontend
docker build -f ./Dockerfile.prod -t $FRONTEND_IMAGE_NAME:$VERSION .

cd ../api
docker build -f ./Dockerfile.prod -t $API_IMAGE_NAME:$VERSION .

cd ../../
rm -rf nearbai-$VERSION

docker save $FRONTEND_IMAGE_NAME:$VERSION | gzip > nearbai-frontend.tar.gz
docker save $API_IMAGE_NAME:$VERSION | gzip > nearbai-api.tar.gz
