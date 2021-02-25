from flask import render_template, url_for, flash, redirect, request
from camctrl import app,db,Presets
import camcmds

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/camcmd")
def camcmd():
    cmd= request.args.get('cmd', 'stop')
    val1= request.args.get('val1',0)
    val2= request.args.get('val2',0)
    duration= request.args.get('duration',0)
    camcmds.send_cmd(cmd,int(val1),int(val2),int(duration))
    return cmd

@app.route("/debug")
def debugMessage():
    return 'debug'

@app.route("/getpreset")
def getpreset():
    preset = request.args.get('preset', '1')
    presetsDB=Presets.query.filter_by(id=int(preset)).first()
    return presetsDB.Label

@app.route("/getpresets")
def getpresets():
    thesePresets=Presets.query.all()
    presetOutput=""
    for eachPreset in thesePresets:
        presetOutput=presetOutput+str(eachPreset.id)+","+eachPreset.Label+"|"
    return presetOutput



@app.route("/setpreset")
def setpreset():
    preset = request.args.get('preset', '1')
    label = request.args.get('label', 'Preset '+str(preset))
    presetsDB=Presets.query.filter_by(id=int(preset)).first()
    presetsDB.Label=label
    db.session.commit()
    presetsDB=Presets.query.filter_by(id=int(preset)).first()
    return presetsDB.Label



