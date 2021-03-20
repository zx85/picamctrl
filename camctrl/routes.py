from flask import render_template, url_for, flash, redirect, request
from camctrl import app,db,Presets
import camcmds

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/obs")
def obs():
    return render_template('obs.html')

@app.route("/setup")
def setup():
    return render_template('setup.html')

@app.route("/camcmd/<cmd>/<val1>/<val2>/<duration>")
def camcmd(cmd="stop",val1="0",val2="0",duration="0"):
    camcmds.send_cmd(cmd,int(val1),int(val2),int(duration))
    return cmd

@app.route("/debug")
def debugMessage():
    return 'debug'

@app.route("/call/<preset>")
def callpreset(preset):
    cmd= "callpreset"
    val1= "0"
    val2= preset
    duration= "0"
    camcmds.send_cmd(cmd,int(val1),int(val2),int(duration))
    return cmd

@app.route("/get/<preset>")
def getpreset(preset):
    presetsDB=Presets.query.filter_by(id=int(preset)).first()
    return presetsDB.Label

@app.route("/getpresets")
def getpresets():
    thesePresets=Presets.query.all()
    presetOutput=""
    for eachPreset in thesePresets:
        presetOutput=presetOutput+str(eachPreset.id)+","+eachPreset.Label+"|"
    return presetOutput

@app.route("/set/<path:preset>/<path:label>")
def setpreset(preset="1",label="Preset"):
    print(preset,label)
    presetsDB=Presets.query.filter_by(id=int(preset)).first()
    presetsDB.Label=label
    db.session.commit()
    presetsDB=Presets.query.filter_by(id=int(preset)).first()
    cmd='setpreset'
    val1="0"
    val2=preset
    duration="0"
    camcmds.send_cmd(cmd,int(val1),int(val2),int(duration))

    return presetsDB.Label



