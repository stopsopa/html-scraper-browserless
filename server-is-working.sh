#!/bin/bash

#set -o xtrace
#set -e

FLAG=$1

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

THISFILE="$(basename $0)"

if [ "$#" == 0 ] ; then

      echo "give flag parameter"

      exit 1
fi

COUNT=$(ps aux | grep $FLAG | grep -v grep | grep -v "$THISFILE" | wc -l)

if [ "$COUNT" != "1" ]; then

    echo 'not working'

    exit 1
fi

echo 'is working';

