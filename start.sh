
# /bin/bash kill.sh && node server.js --port 8811 --tmp tmp/ -- force port from cli

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

LOGFILE="$DIR/logs/$(date "+%Y-%m-%d-%H-%M-%S").log"

node server.js --flag html-scraper-browserless  1>> $LOGFILE 2>> $LOGFILE & disown