#!/bin/bash

# set -e

# set -o xtrace

make status

if [ "$?" = "0" ]; then

    echo "-=else=-"
else

    echo "-=not working start=-"

    make start
fi


echo "-=end everyminute.sh=-"

