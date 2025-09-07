import random
import copy
import os
from flask import Blueprint, request, jsonify, abort
import json, time
from routers.history_routes import InterviewRecordManager
from routers.student_model import StudentService

call_bp = Blueprint('call', __name__)


class JsonOptions:
    def __init__(self, path, ):
        self.path = path
        self.jsonObj = open(self.path, 'r', encoding='utf-8')

    def __enter__(self):
        self.jsonObj = open(self.path, 'r', encoding='utf-8')
        return self.jsonObj

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.jsonObj.close()

    def get_json(self):
        return json.load(self.jsonObj)

    def set_json(self, data):
        with open(self.path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)


# 使用os.path.join确保跨平台兼容性
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
name_path = os.path.join(BASE_DIR, 'data', 'students.json')
lib_path = os.path.join(BASE_DIR, 'data', 'call.json')


@call_bp.route('/api/roll-call', methods=['GET'])
def call():
    return jsonify({
        'status': '200'
    })


# 获取随机面试官
@call_bp.route('/api/roll-call/random-interviewers', methods=['GET'])
def random_interviewers():
    lib = JsonOptions(lib_path)
    call_data = lib.get_json()

    call_history = call_data['call_history']
    interview_history = call_data['interview_history']
    print('interview_history', interview_history)
    interview_history.extend(call_history)

    # 随机获取count个面试官
    count = request.args.get('count', default=1, type=int)  # 获取 count 参数，默认为1

    can_call_list = []
    three_days_ago = time.time() - 60 * 60 * 24 * 3
    three_days_list = list(filter(lambda item: item['time'] > three_days_ago, interview_history))

    interview_history_name_list = [item['name'] for item in three_days_list]
    total_list = JsonOptions(name_path).get_json()

    for item in total_list:
        if item['name'] not in interview_history_name_list:
            can_call_list.append(item)
    # 获取随机名单
    index_list = []
    for i in range(count):
        if len(can_call_list) == 0:
            break
        index = random.randint(0, len(can_call_list) - 1)
        if can_call_list[index]:
            currentItem = can_call_list.pop(index)
            currentItem[
                "avatar"] = 'https://api.dicebear.com/7.x/avataaars/svg?seed=81cc91ea-1159-4a71-bfa6-5923f473fe37'
            currentItem['jobSeekingCount'] = currentItem['applicant_count']
            currentItem['interviewCount'] = currentItem['interviewer_count']
            currentItem['id'] = currentItem['student_id']
            index_list.append(currentItem)

    interview_history.extend([{
        'id': item['id'],
        'name': item['name'],
        'time': time.time()
    } for item in index_list])

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


# 获取随机学生
@call_bp.route('/api/roll-call/random-student', methods=['GET'])
def random_student():
    try:
        count = request.args.get('count', default=1, type=int)  # 获取 count 参数，默认为1
        lib = JsonOptions(lib_path)
        call_data = lib.get_json()
        call_history = call_data['call_history']

        call_name_list = [item['name'] for item in call_history]

        total_list = JsonOptions(name_path).get_json()
        can_call_list = []
        for item in total_list:
            if item['name'] not in call_name_list:
                can_call_list.append(item)


        if len(can_call_list) == 0:
            can_call_list = copy.deepcopy(total_list)
            call_history = []
        new_call_list = []
        if count > len(can_call_list):
            gap = count - len(can_call_list)
            for i in range(gap):
                index = random.randint(0, len(call_name_list) - 1)
                item  = call_history[index]
                new_call_list.append(item)
            can_call_list.extend(new_call_list)
        index_list = []
        for i in range(count):
            index = random.randint(0, len(can_call_list) - 1)
            currentItem = can_call_list.pop(index)
            currentItem[
                "avatar"] = 'https://api.dicebear.com/7.x/avataaars/svg?seed=81cc91ea-1159-4a71-bfa6-5923f473fe37'
            currentItem['jobSeekingCount'] = currentItem['applicant_count']
            currentItem['interviewCount'] = currentItem['interviewer_count']
            currentItem['id'] = currentItem['student_id']
            index_list.append(currentItem)
        if len(new_call_list) > 0:
            call_history = new_call_list
        else :
            call_history.extend([{
                'id': item['id'],
                'name': item['name'],
                'time': time.time()
            } for item in index_list])

        # 保存表
        lib.set_json({
            'call_history': call_history,
            'interview_history': call_data['interview_history']
        })
        #  id: string;
        # name: string;
        # avatar: string;
        # jobSeekingCount: number;
        # interviewCount: number;
        # earnings: number;
        return jsonify({
            "code": 200,
            "data": index_list,
            "message": "ok"
        })
    except Exception as e:
        print('e', e)
        return jsonify({
            "error": str(e),
        }), 500





# 获取获取学生状态
@call_bp.route('/api/roll-call/get-call-status', methods=['GET'])
def save_interview_history():
    try:
        call_data = JsonOptions(lib_path).get_json()

        called_list = call_data['call_history']

        student_service = StudentService()

        total_list = student_service.get_all_students()

        return jsonify({
            'status': '200',
            'data': {
                "total": len(total_list),
                'called_count': len(called_list)
            }
        })
    except Exception as e:
        return jsonify({
            'status': '400',
            'data': None,
            'msg': f'error: {str(e)}'
        }), 500


# 保存面试记录
@call_bp.route('/api/roll-call/submit-result', methods=['POST'])
def submit_result():
    try:
        data = request.get_json()
        student_service = StudentService()
        interviewer = student_service.get_student_by_id(data['interviewerId'])

        print('interviewer', interviewer)
        candidate = student_service.get_student_by_id(data['studentId'])
        if candidate:
            if data['result'] == 'success':
                candidate.funds += int(data['reward'])
            candidate.applicant_count += 1
            student_service.update_student(candidate)

        if interviewer:
            if data['result'] != 'success':
                interviewer.funds += int(data['reward'])
            interviewer.interviewer_count += 1
            student_service.update_student(interviewer)

        record_manager = InterviewRecordManager()

        record_manager.add_record({
            "date": data['timestamp'],
            "candidate": candidate.name,
            "interviewer": interviewer.name,
            "interviewerId": data['interviewerId'],
            "question": data['question'],
            "score_result": data['result'],
            "reward_amount": data['reward'],
        })

        return jsonify({
            'status': '200',
            'data': record_manager.get_all_records()
        })
    except Exception as e:
        return jsonify({
            'status': '400',
            'data': None,
            'msg': f'error: {str(e)}'
        }), 500
