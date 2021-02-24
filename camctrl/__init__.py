from flask import Flask
import camcmds
import checkdb
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

from camctrl import routes