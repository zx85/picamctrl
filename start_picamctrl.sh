#!/bin/bash
cd /opt/picamctrl
nohup python3 run.py </dev/null >/dev/null 2>&1 &
