from flask import render_template, url_for, flash, redirect, request
from camctrl import app
import camcmds

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/camcmd")
def camcmd():
    cmd= request.args.get('cmd', '')
    val1= request.args.get('val1',0)
    val2= request.args.get('val2',0)
    duration= request.args.get('duration',0)
    camcmds.send_cmd(cmd,int(val1),int(val2),int(duration))
    return cmd

@app.route("/debug")
def debugMessage():
    return 'debug'


