#!/usr/bin/env python3
import curses
import time
import serial
import serial.rs485
import sys
import binascii
import inspect

# This function takes a command string and sends individual bytes.

def switch_cmd(argument):
    switcher = {
        "stop": (0,0),
        "up": (0,8),
        "ul": (0,12),
        "ur": (0,10),
        "down": (0,16),
        "dl": (0,20),
        "dr": (0,18),
        "left": (0,4),
        "right": (0,2),
        "zoomout": (0,64),
        "zoomin": (0,32),
        "focusout": (0,128),
        "focusin": (1,0),
        "irisopen": (2,0),
        "irisclose": (4,0),
        "setpreset": (0,3),
        "clearpreset": (0,5),
        "callpreset": (0,7)
    }
    return switcher.get(argument, (0,0))

def do_hex(hexlist):
    out_hex=""
    for eachitem in hexlist:
        out_hex=out_hex+("{0:#04x}".format(int(eachitem))[2:])
    return out_hex

def assemble_cmd(cmd,val1,val2):
    header=0xff
    channel=0x00
    byte1,byte2=switch_cmd(cmd)
    checksum=(header+channel+byte1+byte2+val1+val2)%256
    return do_hex([header,channel,byte1,byte2,val1,val2,checksum])

def stop():
    return bytearray.fromhex(assemble_cmd(switch_cmd("stop"),0,0))
 
def send_cmd(cmd,val1,val2,duration):
    cmd_string=assemble_cmd(cmd,val1,val2)
#    ser=serial.rs485.RS485(port='/dev/serial0',baudrate=2400,parity=serial.PARITY_NONE,stopbits=serial.STOPBITS_ONE,bytesize=serial.EIGHTBITS)
    ser=serial.Serial(port='/dev/serial0',baudrate=9600,parity=serial.PARITY_NONE,stopbits=serial.STOPBITS_ONE,bytesize=serial.EIGHTBITS)
#    ser=serial.rs485.RS485(port='/dev/ttyAMA0',baudrate=2400,parity=serial.PARITY_NONE,stopbits=serial.STOPBITS_ONE,bytesize=serial.EIGHTBITS)
#    ser.rs485_mode = serial.rs485.RS485Settings(False,True)

#    cmd_name,cmd_string=cmd
#    cmd_name,cmd_string=cmd
#    print ("\ncmd_name:", cmd_name)
    print (cmd," ",str(val1),".",str(val2),": ",cmd_string,"for ",duration," ms")
    cmd_bytes = bytearray.fromhex(cmd_string)
    ser.write(cmd_bytes)
    time.sleep(duration/1000)
    ser.write(stop())


