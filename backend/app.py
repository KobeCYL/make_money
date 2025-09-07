from flask import Flask, jsonify
from routers.call_routers import call_bp
from routers.demo_routes import demo_dp
from routers.student_model import students_bp
from routers.history_routes import history_bp
app = Flask(__name__)


app.register_blueprint(call_bp)
app.register_blueprint(demo_dp)
app.register_blueprint(students_bp)
app.register_blueprint(history_bp)

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