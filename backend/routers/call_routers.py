from flask import  Blueprint, request, jsonify, abort
import json

call_bp = Blueprint('call', __name__)


@call_bp.route('/call', methods=['GET'])
def call():
    return jsonify({
        'status': '200'
    })

# 获取随机面试官
@call_bp.route('/roll-call/interviewers', methods=['POST'])
def call():
    data = request.get_data()
    print('data', data)

    try:
        data = json.loads(data)

        # id: string;
        # name: string;
        # avatar: string;
        # title: string;
        # interviewCount: number;
        # successRate: number;
                          
        return jsonify({
          "code": 200,
            "data": [{
                'id': '1',
                'name': 'kobe',
                'avatar': 1,
                'jobSeekingCount': 1,
                'interviewCount': 1,
                'earnings': 1
            }]
        })
    except:
        return jsonify({
            "error": '数据不对'
        }), 400
    
# 获取随机学生
@call_bp.route('roll-call/random-student', methods=['GET'])
def call():
    data = request.get_data()
    print('data', data)

    try:
        data = json.loads(data)
        #  id: string;
        # name: string;
        # avatar: string;
        # jobSeekingCount: number;
        # interviewCount: number;
        # earnings: number;
        return jsonify({
          "code": 200,
            "data": [{
                'id': '1',
                'name': 'kobe',
                'avatar': 1,
                'jobSeekingCount': 1,
                'interviewCount': 1,
                'earnings': 1
            }]
        })
    except:
        return jsonify({
            "error": '数据不对'
        }), 400