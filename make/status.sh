#!/bin/bash
# usage examples:
#
# /bin/bash $0 FLAG
#   will search for FLAG variable in global variables
#
# /bin/bash $0 FLAG .env
# /bin/bash $0 FLAG ../.env
# /bin/bash $0 FLAG ../dir/.env
#   will search for FLAG variable in global variables but before it will load pointed .env file
#

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

source "$DIR/common.sh"

PROC="$(ps aux | grep "${__FLAG}-main" | grep -v grep)" || true

PROC="$(trim "$PROC")" || true

function green {
    printf "\e[32m$1\e[0m\n"
}

function red {
    printf "\e[31m$1\e[0m\n"
}

if [ "$PROC" == "" ]; then

    red "\n\n   SERVICE IS OFF\n\n"

    exit 1;
fi

green "\n\n   SERVICE IS ON\n\n"

