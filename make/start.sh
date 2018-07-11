#!/bin/bash

set -e

set -o xtrace

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

source "$DIR/../.env"

LOGDIR="$DIR/../logs"

mkdir -p "$LOGDIR"

LOGFILE="$LOGDIR/000-forever.log"

rm -rf $LOGFILE

# node node_modules/.bin/forever --no-colors -d -t --minUptime 5000 --spinSleepTime 10000 -v -a -c /bin/bash run.sh $FLAG 1>> $LOGFILE 2>> $LOGFILE & disown
node node_modules/.bin/forever --no-colors -d -t --minUptime 2000 -v -a -c $@ $FLAG 1>> $LOGFILE 2>> $LOGFILE & disown
