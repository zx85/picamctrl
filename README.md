# picamctrl

A project created so that I can control an RS485 camera using PELCO-D protocol from my Raspberry pi.

## What you'll need

- A Raspberry Pi (old as you like, as long as it has a 40 pin GPIO)
- An RS485 HAT. I spent a whole £12 on this: https://thepihut.com/products/rs485-pizero by [AB Electronics](https://www.abelectronics.co.uk/p/77/rs485-pi)
- Python3     (should be there already)
- pip (apt install python3-pip)
- pyserial (pip3 install pyserial)
- flask (pip3 install flask)
- flask_SQLAlchemy (pip3 install flask_sqlalchemy)

## How to install

- clone this repository
- connect the RS485 cable to the port on the HAT
- run python3 run.py 
- go to a browser http://<IP ADDRESS OF THE PI>:5000

## It's a bit of a mess

- Still loads of comments
- Touch and mouse both work though



