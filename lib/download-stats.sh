#!/usr/bin/env bash

DAY=$1
URL=https://plausible.io/cryptick.wildvale.co.uk/export
QUERY="period=168h&date=${DAY}&filters=%5B%5B%22is%22%2C%22event%3Agoal%22%2C%5B%22Clue%3A%3ASolved%22%5D%5D%5D&interval=day&comparison=undefined"

mkdir -p data/

curl -fsSL "${URL}?${QUERY}" -o temp.zip || { echo "Download failed"; exit 1; }
unzip -p temp.zip pages.csv > data/pages.csv || { echo "Extraction failed"; rm temp.zip; exit 1; }

rm -f temp.zip