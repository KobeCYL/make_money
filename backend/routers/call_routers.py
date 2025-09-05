from flask import  Blueprint, request, jsonify, abort


call_bp = Blueprint('call', __name__, url_prefix='/call')


@call_bp.route('/', methods=['GET'])
def call():
    return jsonify({
        'status': '200'
    })