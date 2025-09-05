from flask import  Blueprint, request, jsonify, abort
import json

user_bp = Blueprint('user', __name__)


@user_bp.route('/user', methods=['GET'])
def call():
    return jsonify({
        'status': '200',
        'msg': 'user_bp'
    })