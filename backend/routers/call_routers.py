from flask import  Blueprint, request, jsonify, abort
import json, time, random

call_bp = Blueprint('call', __name__)

class JsonOptions:
    def __init__(self, path,):
        self.path = path
        self.jsonObj = None
    def __enter__(self):
        self.jsonObj =  open(self.path, 'r', encoding='utf-8') 
        return self.jsonObj
    def __exit__(self, exc_type, exc_val, exc_tb):

        self.jsonObj.close()

    def get_json(self):
        return json.load(self.jsonObj)

    def set_json(self, data):
        json.dump(data, self.jsonObj, ensure_ascii=False)

name_path = 'data/name.json'

lib_path = 'data/call.json'
    
@call_bp.route('/call', methods=['GET'])
def call():
    return jsonify({
        'status': '200'
    })



# 获取随机面试官
@call_bp.route('/roll-call/interviewers', methods=['GET'])
def call():
    lib = JsonOptions(lib_path)
    call_data = lib.get_json()
    data = request.get_json()
    call_history = call_data['call_history']
    interview_history = call_data['interview_history']
    interview_history.concat(call_history)
    count = data['count']
    # 随机获取count个面试官
    can_call_list = []
    total_list = JsonOptions(name_path).get_json()

    currentTime = time.time()
    for item in total_list:
        if item['name'] not in can_call_list:
            can_call_list.append(item)
    # 获取随机名单
    index_list = []
    for i in range(count):
        index = random.random(0,len(can_call_list)-1)
        currentItem = can_call_list.pop(index)
        index_list.append(currentItem)
        
    interview_history.concat(index_list)

    # 保存表
    lib.set_json({
        'call_history': call_history,
        'interview_history': interview_history
    })

    return jsonify({
        'code': 200,
        'data': index_list,
        'message': 'ok'
    })

   

    # 获取3天前的时间
    threeDayTime = currentTime - 60 * 60 * 24 * 3

    # 判断一个时间是在3天内
  

    data = request.get_data()
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