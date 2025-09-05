from flask import  Blueprint, request, jsonify, abort
import json

history_bp = Blueprint('history', __name__)


@history_bp.route('/history', methods=['GET'])
def call():
    return jsonify({
        'status': '200',
        'msg': 'history'
    })