#!/usr/bin/env bash

DAY=$1
URL=https://plausible.io/api/stats/cryptick.wildvale.co.uk/export/
mkdir -p data/

curl "${URL}" -H 'accept: */*' -H 'content-type: application/json' \
  -H 'user-agent: Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1' \
  --data-raw "{
    \"date_range\":\"30d\",
    \"relative_date\":\"${DAY}\",
    \"filters\":[[\"is\",\"event:goal\",[\"Clue::Solved\"]]],
    \"include\":{\"imports\": true},
    \"reports\":{
      \"pages.csv\":{
        \"dimensions\":[\"event:page\"],
        \"metrics\":[\"visitors\",\"group_conversion_rate\"]
       }
      }
    }" -o data/temp.zip || { echo "Download failed"; exit 1; }

unzip -p data/temp.zip pages.csv > data/pages.csv || { echo "Extraction failed"; rm data/temp.zip; exit 1; }

rm -f data/temp.zip