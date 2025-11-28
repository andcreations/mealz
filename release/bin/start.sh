#!/bin/bash

MEALZ_DIR=$(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd)
PID_FILE=$MEALZ_DIR/.pid

ENV_FILE=$HOME/.mealz/env
if [ -f $ENV_FILE ]; then
    echo Reading environment from $ENV_FILE
    source $ENV_FILE
fi

if [ -f $PID_FILE ]; then
    SERVER_PID=`cat $PID_FILE`

    # check if the process exists
    kill -0 $SERVER_PID 1> /dev/null 2> /dev/null
    if [ $? -eq 0 ]; then
        echo The pid file $PID_FILE and corresponding process exist.
        echo Very likely the server is already running.
        exit 0
    fi

    # remove the pid file
    echo The pid file $PID_FILE exists, but no corresponding process found.
    echo Removing the pid file.
   rm $PID_FILE
fi

if [ -z $MEALZ_NODE ]; then
    MEALZ_NODE=node
fi

# run the server
nohup $MEALZ_NODE $MEALZ_DIR/backend-server/dist/main.js&

# store the pid in the file
echo $! > $PID_FILE