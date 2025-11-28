#!/bin/bash

MEALZ_DIR=$(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd)
PID_FILE=$MEALZ_DIR/.pid

if [ ! -f $PID_FILE ]; then
    echo The pid file $PID_FILE does not exist.
    echo Seems that the server is not running.
    exit 0
fi

# read pid from the file
SERVER_PID=`cat $PID_FILE`
kill $SERVER_PID

# wait for the server process to stop
tail --pid=$SERVER_PID -f /dev/null

# clean up
rm $PID_FILE