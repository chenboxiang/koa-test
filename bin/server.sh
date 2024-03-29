#!/bin/bash

export NODE_ENV='production'

ulimit -c unlimited
cd `dirname $0`/..
NODEJS='node --harmony'
BASE_HOME=`pwd`
PROJECT_NAME=`basename ${BASE_HOME}`
STDOUT_LOG=`$NODEJS -e "console.log(require('path').join(require('$BASE_HOME/config').logdir, 'nodejs_stdout.log'));
process.exit(0);"`
NODE_DISPATCH_PATH=${BASE_HOME}/dispatch.js
PROG_NAME=$0
ACTION=$1

usage() {
  echo "Usage: $PROG_NAME {start|stop|status|restart}"
  exit 1;
}

if [ $# -lt 1 ]; then
  usage
fi

function get_pid {
  PID=`ps ax | grep node | grep ${PROJECT_NAME}/dispatch.js | awk '{print $1}'`
}

#start nodejs
start()
{
   get_pid
   if [ -z $PID ]; then
      echo "Starting $PROJECT_NAME ..."
      echo "nohup $NODEJS $NODE_DISPATCH_PATH > $STDOUT_LOG 2>&1 &"
      nohup $NODEJS $NODE_DISPATCH_PATH > $STDOUT_LOG  2>&1 &
      sleep 2
      get_pid
      echo "Start nodejs success. PID=$PID"
   else
      echo "$PROJECT_NAME is already running, PID=$PID"
   fi
}

stop()
{
  get_pid
  if [ ! -z "$PID" ]; then
    echo "Waiting $PROJECT_NAME stop for 2s ..."
    kill -15 $PID
    sleep 2

    node_num=`ps -ef |grep node|grep ${PROJECT_NAME}|grep -v grep|wc -l`
    if [ $node_num != 0 ]; then
      ps -ef |grep node | grep ${PROJECT_NAME} |grep -v grep|awk '{print $2}'|xargs kill -9
      ipcs -s | grep 0x | awk '{print $2}' | xargs -n1 ipcrm -s  > /dev/null 2>&1
      ipcs -m | grep 0x | awk '{print $2}' | xargs -n1 ipcrm -m  > /dev/null 2>&1
    fi
  mv -f $STDOUT_LOG "${STDOUT_LOG}.`date '+%Y%m%d%H%M%S'`"
  else
    echo "$PROJECT_NAME is not running"
  fi
}

status()
{
  get_pid
  if [ ! -z $PID ]; then
    echo "$PROJECT_NAME PID: $PID"
    node_processes=`ps -ef | grep $PID | grep -v grep`
    echo "master:"
    echo "$node_processes" | grep dispatch.js
    worker_count=`echo "$node_processes" | grep -v dispatch.js | wc -l`
    echo "workers: $worker_count"
    echo "$node_processes" | grep -v dispatch.js
  else
    echo "$PROJECT_NAME is not running"
  fi
  exit 0;
}

case "$ACTION" in
  start)
    start
  ;;
  status)
    status
  ;;
  stop)
    stop
  ;;
  restart)
    stop
    start
  ;;
  *)
    usage
  ;;
esac