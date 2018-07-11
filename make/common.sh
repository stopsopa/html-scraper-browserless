#!/bin/bash

set -e

set -o xtrace

if [ $# -lt 1 ]; then

    printf "\n    ERROR: first parameter not given like:\n    /bin/bash $0 FLAG\n\n"

    exit 1;
fi

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

if [ $# -gt 1 ]; then

    # source "$DIR/../.env"
    source "$DIR/../$2"
fi

trim() {
    local var="$*"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"
    echo -n "$var"
}

FLAG_VARIABLE=$1

__FLAG="$(eval echo "\$$FLAG_VARIABLE")"

__FLAG="$(trim "$__FLAG")" || true

# source "$DIR/test-timer.sh"