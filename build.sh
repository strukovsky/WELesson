#!/bin/bash


echo $1
#$1 -- image
set -e
docker buildx create --use
docker buildx build --platform linux/amd64 --push -t $1 .

inspectResult=$(docker inspect $1 | grep '"Id": "sha256')
imageHash=$(awk -F'"Id": "sha256:|",' '{print $2}' <<< "$inspectResult")

printf "image - $1 \nimageHash - $imageHash\n"