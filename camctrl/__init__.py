from flask import Flask
import camcmds
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine


# Do setup in case it's needed
dbFilename = "camctrl.db"
sqliteString="sqlite:///"+dbFilename
app = Flask(__name__)
app.config['SECRET_KEY'] = '1628bb0b13ce0c676dfde280ba24a579'
app.config['SQLALCHEMY_DATABASE_URI'] = sqliteString
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Something about this I suspect
# https://flask.palletsprojects.com/en/1.1.x/tutorial/database/#register-with-the-application


class Presets(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        Label = db.Column(db.String(20), unique=True, nullable=False)

        def __repr__(self):
            return ("Presets("+str(self.id)+", '"+str(self.Label)+"')")



# if the DB isn't there create it
if not os.path.isfile("camctrl/"+dbFilename) :
    print ("Creating DB")
    db.create_all()
    for eachPreset in range(1, 10):
        db.session.add(Presets(id=eachPreset,Label="Preset "+str(eachPreset)))
    db.session.commit()

from camctrl import routes
