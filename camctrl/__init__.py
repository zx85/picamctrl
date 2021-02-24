from flask import Flask
import camcmds
#from flask_sqlalchemy import SQLAlchemy
# Do setup in case it's needed


app = Flask(__name__)
app.config['SECRET_KEY'] = '1628bb0b13ce0c676dfde280ba24a579'


from camctrl import routes


