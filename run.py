from camctrl import app

if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0',threaded=True,processes=1,port=5100)
#    app.run(debug=True,host='0.0.0.0',threaded=True,processes=1,port=5100)
#    app.run(host='0.0.0.0:5100')
