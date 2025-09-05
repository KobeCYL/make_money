from flask import  Blueprint, request, jsonify, abort
import json

call_bp = Blueprint('call', __name__)


@call_bp.route('/call', methods=['GET'])
def call():
    return jsonify({
        'status': '200'
    })