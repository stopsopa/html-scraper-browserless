
# /bin/bash kill.sh && node server.js --port 8811 --tmp tmp/ --force port from cli

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

LOGFILE="$DIR/logs/$(date "+%Y-%m-%d-%H-%M-%S").log"

echo "-=$DIR=-"

echo "-=node version: $(node -v)=-"

if [ "$NODE" = "" ]; then

    NODE=node
fi

$NODE server.js --flag html-scraper-browserless-executed-by-make  1>> $LOGFILE 2>> $LOGFILE & disown

echo "-=server should work=-"

make status