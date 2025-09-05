from flask import Flask, jsonify
from routers.call_routers import call_bp
from routers.demo_routes import demo_dp
app = Flask(__name__)


app.register_blueprint(call_bp, url_prefix='/api/call')
app.register_blueprint(demo_dp, url_prefix='/api/demo')

@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': f'Not Found: {str(error)}'}), 404


@app.errorhandler(400)
def bad_request(error):
    return jsonify({'message': f'Bad Request: {str(error)}'}), 400

@app.errorhandler(500)
def server_error(error):
    return jsonify({'message': f'Internal Server Error: {str(error)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)