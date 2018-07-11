#!/bin/bash

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

source "$DIR/.env"

source "$DIR/make/test-timer.sh"

TIME="$(_datetime)";

LOGDIR="$DIR/logs/$(_date)"

mkdir -p "$LOGDIR"

LOGFILE="$LOGDIR/$(_time).log"

echo -e "-----v $TIME v----->>>\n" >> $LOGFILE

if [ "$DIEAFTER" == "" ]; then
    DIEAFTER="5000"
fi

# $FLAG-main is for status command, that's it
node server.js --port $PORT --flag $FLAG-main --dieafter $DIEAFTER 1>> $LOGFILE 2>> $LOGFILE
# node server.js --port $PORT --flag $FLAG-main 1>> $LOGFILE 2>> $LOGFILE

echo -e "<<<\nstopped with status code: $?\n-----^-----\n" >> $LOGFILE



