from flask import Flask, jsonify
from routers.call_routers import call_bp
from routers.demo_routes import demo_dp
from routers.student_model import students_bp
from routers.history_routes import history_bp
from routers.user_routes import user_bp
from flask_cors import CORS  # 导入 CORS
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})  # 启用 CORS，允许所有源和方法

app.register_blueprint(call_bp)
app.register_blueprint(demo_dp)
app.register_blueprint(students_bp)
app.register_blueprint(history_bp)
app.register_blueprint(user_bp)

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
     app.run(host='0.0.0.0', debug=True)
