#!/bin/bash

# use:
# /bin/bash kill.sh flag-name
# to ignore this script
# /bin/bash kill.sh flag-name $$
# /bin/bash kill.sh flag-name $$ something-else-to-ignore "and something else"

#set -o xtrace
#set -e

FLAG=$1
THISFILE="$(basename $0)" || true


LIST=$(docker ps --format '{{.Names}}' | grep pup-pdf-) || true

echo -e "\nlisting of containers to kill:\n";
echo -e $"$LIST\n"

for name in $LIST
do
    echo "attempt to shutdown $name"
    docker rm --force $name && echo 'success' || echo 'failure'

    printf "\n"
done

echo -e "\n"

exit 0;

