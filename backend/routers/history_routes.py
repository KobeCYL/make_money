from flask import Flask, request, jsonify, Blueprint
import json
import datetime
from typing import List, Dict, Optional



class InterviewRecordManager:
    def __init__(self, data_file: str = "data/interview_records.json"):
        self.data_file = data_file
        self.records = self._load_data()
        # 初始化当前最大ID
        self.current_id = max([record.get('id', 0) for record in self.records], default=0)
        print('self.current_id', self.current_id, type(self.current_id))

    def _load_data(self) -> List[Dict]:
        """加载数据从JSON文件"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def _save_data(self):
        """保存数据到JSON文件"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.records, f, ensure_ascii=False, indent=2)

    def _generate_id(self) -> int:
        """生成自增ID"""
        print('self.current_id', self.current_id, type(self.current_id))

        self.current_id += 1
        return self.current_id

    def add_record(self, record_data: Dict) -> Dict:
        """添加新的面试记录"""
        required_fields = ['date', 'candidate', 'interviewer', 'question', 'score_result', 'reward_amount']
        for field in required_fields:
            if field not in record_data:
                raise ValueError(f"缺少必要字段: {field}")

        record = {
            'id': self._generate_id(),
            'date': record_data['date'],
            'candidate': record_data['candidate'],
            'interviewer': record_data['interviewer'],
            'question': record_data['question'],
            'score_result': record_data['score_result'],
            'reward_amount': record_data['reward_amount']
        }

        self.records.append(record)
        self._save_data()
        return record

    def get_all_records(self) -> List[Dict]:
        """获取所有面试记录"""
        return self.records

    def get_record_by_id(self, record_id: int) -> Optional[Dict]:
        """根据ID获取特定记录"""
        try:
            record_id = int(record_id)
        except (ValueError, TypeError):
            return None

        for record in self.records:
            if record['id'] == record_id:
                return record
        return None

    def get_records_by_candidate(self, candidate_name: str) -> List[Dict]:
        """根据求职者姓名获取记录"""
        return [record for record in self.records if record['candidate'] == candidate_name]

    def get_records_by_interviewer(self, interviewer_name: str) -> List[Dict]:
        """根据面试官姓名获取记录"""
        return [record for record in self.records if record['interviewer'] == interviewer_name]

    def update_record(self, record_id: int, update_data: Dict) -> Optional[Dict]:
        """更新记录"""
        try:
            record_id = int(record_id)
        except (ValueError, TypeError):
            return None

        for i, record in enumerate(self.records):
            if record['id'] == record_id:
                # 只更新提供的字段
                for key, value in update_data.items():
                    if key in record and key != 'id':  # 不允许更新ID
                        record[key] = value
                self.records[i] = record
                self._save_data()
                return record
        return None

    def delete_record(self, record_id: int) -> bool:
        """删除记录"""
        try:
            record_id = int(record_id)
        except (ValueError, TypeError):
            return False

        for i, record in enumerate(self.records):
            if record['id'] == record_id:
                del self.records[i]
                self._save_data()
                return True
        return False

    def search_records(self, search_criteria: Dict) -> List[Dict]:
        """根据搜索条件查找记录"""
        results = []
        for record in self.records:
            match = True
            for key, value in search_criteria.items():
                if key in record and record[key] != value:
                    match = False
                    break
            if match:
                results.append(record)
        return results


# 创建全局记录管理器实例
record_manager = InterviewRecordManager()


def generate_test_data():
    """生成初始测试数据"""
    test_records = [
        {
            'date': '2024-03-12 14:30:00',
            'candidate': '张三',
            'interviewer': '李四',
            'question': '请描述一下你最近完成的一个项目',
            'score_result': '能力达标',
            'reward_amount': 'Y20.00'
        },
        {
            'date': '2024-03-13 10:00:00',
            'candidate': '王五',
            'interviewer': '赵六',
            'question': '请谈谈你的职业规划',
            'score_result': '优秀',
            'reward_amount': 'Y30.00'
        },
        {
            'date': '2024-03-14 15:45:00',
            'candidate': '李七',
            'interviewer': '孙八',
            'question': '你如何处理工作中的冲突',
            'score_result': '合格',
            'reward_amount': 'Y15.00'
        },
        {
            'date': '2024-03-15 09:30:00',
            'candidate': '刘九',
            'interviewer': '周十',
            'question': '请描述你的技术栈',
            'score_result': '能力达标',
            'reward_amount': 'Y25.00'
        },
        {
            'date': '2024-03-16 11:20:00',
            'candidate': '陈十一',
            'interviewer': '吴十二',
            'question': '你如何看待团队合作',
            'score_result': '优秀',
            'reward_amount': 'Y35.00'
        }
    ]

    # 只有当没有记录时才添加测试数据
    if not record_manager.get_all_records():
        for record_data in test_records:
            record_manager.add_record(record_data)
        return True
    return False
history_bp = Blueprint('history', __name__)


# Flask路由接口
@history_bp.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        'code': 200,
        'message': '服务正常运行',
        'total_records': len(record_manager.get_all_records())
    })


@history_bp.route('/api/init', methods=['POST'])
def init_test_data():
    """初始化测试数据"""
    try:
        success = generate_test_data()
        if success:
            return jsonify({
                'code': 200,
                'message': '测试数据初始化成功',
                'total': len(record_manager.get_all_records())
            })
        else:
            return jsonify({'code': 400, 'message': '已有数据，不重复初始化'}), 400
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


@history_bp.route('/api/records', methods=['GET'])
def get_all_records():
    """获取所有记录"""
    try:
        records = record_manager.get_all_records()
        return jsonify({
            'code': 200,
            'message': '成功',
            'data': records,
            'total': len(records)
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


@history_bp.route('/api/records/<int:record_id>', methods=['GET'])
def get_record(record_id):
    """根据ID获取记录"""
    try:
        record = record_manager.get_record_by_id(record_id)
        if record:
            return jsonify({'code': 200, 'message': '成功', 'data': record})
        else:
            return jsonify({'code': 404, 'message': '记录不存在'}), 404
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


@history_bp.route('/api/records/candidate/<candidate_name>', methods=['GET'])
def get_records_by_candidate(candidate_name):
    """根据求职者姓名获取记录"""
    try:
        records = record_manager.get_records_by_candidate(candidate_name)
        return jsonify({
            'code': 200,
            'message': '成功',
            'data': records,
            'total': len(records)
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


@history_bp.route('/api/records/interviewer/<interviewer_name>', methods=['GET'])
def get_records_by_interviewer(interviewer_name):
    """根据面试官姓名获取记录"""
    try:
        records = record_manager.get_records_by_interviewer(interviewer_name)
        return jsonify({
            'code': 200,
            'message': '成功',
            'data': records,
            'total': len(records)
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


@history_bp.route('/api/records', methods=['POST'])
def add_record():
    """添加新记录"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'code': 400, 'message': '请求体必须为JSON格式'}), 400

        required_fields = ['date', 'candidate', 'interviewer', 'question', 'score_result', 'reward_amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'code': 400, 'message': f'缺少必要字段: {field}'}), 400

        record = record_manager.add_record(data)
        return jsonify({
            'code': 201,
            'message': '记录添加成功',
            'data': record
        }), 201
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


@history_bp.route('/api/records/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    """更新记录"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'code': 400, 'message': '请求体必须为JSON格式'}), 400

        updated_record = record_manager.update_record(record_id, data)
        if updated_record:
            return jsonify({
                'code': 200,
                'message': '记录更新成功',
                'data': updated_record
            })
        else:
            return jsonify({'code': 404, 'message': '记录不存在'}), 404
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


@history_bp.route('/api/records/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    """删除记录"""
    try:
        success = record_manager.delete_record(record_id)
        if success:
            return jsonify({'code': 200, 'message': '记录删除成功'})
        else:
            return jsonify({'code': 404, 'message': '记录不存在'}), 404
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


@history_bp.route('/api/records/search', methods=['POST'])
def search_records():
    """搜索记录"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'code': 400, 'message': '请求体必须为JSON格式'}), 400

        records = record_manager.search_records(data)
        return jsonify({
            'code': 200,
            'message': '成功',
            'data': records,
            'total': len(records)
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': f'服务器错误: {str(e)}'}), 500


# if __name__ == '__main__':
#     # 启动时生成测试数据
#     generate_test_data()
#     print("初始测试数据已生成")
#     print("Flask服务启动，访问 http://127.0.0.1:5000/api/health 进行健康检查")
#     app.run(debug=True, host='0.0.0.0', port=5000)