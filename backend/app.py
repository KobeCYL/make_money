from flask import Flask
from routers.call_routers import call_bp
app = Flask(__name__)


app.register_blueprint(call_bp)


if __name__ == '__main__':
    app.run()