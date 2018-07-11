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

cd "$DIR"

/bin/bash kill.sh "$__FLAG"


