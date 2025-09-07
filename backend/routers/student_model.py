# student_info_management_system.py
import copy
import json
import os
import re
from datetime import datetime
from typing import List, Optional
from flask import Flask, jsonify, request, Blueprint
import traceback  # 添加这行导入

students_bp = Blueprint('students', __name__, url_prefix='/')


# ==================== Models ====================
class Student:
    def __init__(self, student_id: str, name: str, gender: str = "男", major: str = "未知专业",
                 enrollment_year: int = 2020, birth_date: Optional[str] = None,
                 phone: Optional[str] = None, email: Optional[str] = None,
                 address: Optional[str] = None, status: str = "活跃",
                 interviewer_count: int = 0, applicant_count: int = 0,
                 funds: float = 0.0, ranking: Optional[int] = None):
        self.student_id = student_id
        self.name = name
        self.gender = gender
        self.birth_date = birth_date
        self.major = major
        self.enrollment_year = enrollment_year
        self.phone = phone
        self.email = email
        self.address = address
        self.status = status
        self.interviewer_count = interviewer_count  # 作为面试官的次数
        self.applicant_count = applicant_count  # 作为求职者的次数
        self.funds = funds  # 资金
        self.ranking = ranking  # 排名
        self.created_at = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        self.updated_at = self.created_at  # 初始时相同

    def to_dict(self):
        # 用于API响应和简化存储的字段
        return {
            'id': int(self.student_id) if self.student_id.isdigit() else hash(self.student_id),
            'name': self.name,
            'student_id': self.student_id,
            'is_active': self.status == "活跃",
            'created_at': self.created_at,
            'interviewer_count': self.interviewer_count,
            'applicant_count': self.applicant_count,
            'funds': self.funds,
            'ranking': self.ranking
        }

    def to_full_dict(self):
        # 用于完整信息存储的字段（与to_dict相同，因为我们只有一个文件）
        return {
            'student_id': self.student_id,
            'name': self.name,
            'gender': self.gender,
            'birth_date': self.birth_date,
            'major': self.major,
            'enrollment_year': self.enrollment_year,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'interviewer_count': self.interviewer_count,
            'applicant_count': self.applicant_count,
            'funds': self.funds,
            'ranking': self.ranking
        }

    @classmethod
    def from_dict(cls, data: dict):
        # 从完整格式重建学生对象
        student = cls(
            student_id=data['student_id'],
            name=data['name'],
            gender=data.get('gender', '男'),
            major=data.get('major', '未知专业'),
            enrollment_year=data.get('enrollment_year', 2020),
            birth_date=data.get('birth_date'),
            phone=data.get('phone'),
            email=data.get('email'),
            address=data.get('address'),
            status=data.get('status', '活跃'),
            interviewer_count=data.get('interviewer_count', 0),
            applicant_count=data.get('applicant_count', 0),
            funds=data.get('funds', 0.0),
            ranking=data.get('ranking')
        )

        student.created_at = data.get('created_at', datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))
        student.updated_at = data.get('updated_at', student.created_at)
        return student

    def __str__(self):
        return f"Student(ID: {self.student_id}, Name: {self.name}, Major: {self.major})"


def sort_students_by_funds(students: list, ascending: bool = True) -> list:
    """
    根据资金数量对学生进行排序

    Args:
        students: 学生列表
        ascending: True为升序，False为降序

    Returns:
        排序后的学生列表
    """
    return sorted(students, key=lambda x: x.funds, reverse=not ascending)


def update_rankings(students: list, ascending: bool = True) -> list:
    """
    根据资金数量更新学生的排名

    Args:
        students: 学生列表
        ascending: True为升序排名，False为降序排名

    Returns:
        更新排名后的学生列表
    """
    # 先按资金排序
    sorted_students = sort_students_by_funds(students, ascending)

    # 更新排名
    for i, student in enumerate(sorted_students):
        student.ranking = i + 1

    return sorted_students


# ==================== Validators ====================
def validate_student_data(student: Student) -> dict:
    """验证学生数据"""
    # 检查必填字段
    if not student.student_id:
        return {'valid': False, 'message': '学号不能为空'}

    if not student.name:
        return {'valid': False, 'message': '姓名不能为空'}

    # if not student.gender:
    #     return {'valid': False, 'message': '性别不能为空'}
    #
    # if student.gender not in ['男', '女']:
    #     return {'valid': False, 'message': '性别只能是男或女'}

    # 验证学号格式（假设为数字）
    if not re.match(r'^\d+$', student.student_id):
        return {'valid': False, 'message': '学号只能包含数字'}

    # # 验证入学年份（如果有提供）
    # if student.enrollment_year is not None:
    #     if not isinstance(student.enrollment_year, int):
    #         return {'valid': False, 'message': '入学年份必须是整数'}
    #
    #     current_year = datetime.now().year
    #     if student.enrollment_year < 1900 or student.enrollment_year > current_year:
    #         return {'valid': False, 'message': f'入学年份应在1900-{current_year}之间'}
    #
    # # 验证邮箱格式（如果有提供）
    # if student.email and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', student.email):
    #     return {'valid': False, 'message': '邮箱格式不正确'}
    #
    # # 验证手机号格式（如果有提供）
    # if student.phone and not re.match(r'^1[3-9]\d{9}$', student.phone):
    #     return {'valid': False, 'message': '手机号格式不正确'}

    # 验证面试官次数字段（如果有提供）
    if student.interviewer_count is not None:
        if not isinstance(student.interviewer_count, int) or student.interviewer_count < 0:
            return {'valid': False, 'message': '面试官次数必须是非负整数'}

    # 验证求职者次数字段（如果有提供）
    if student.applicant_count is not None:
        if not isinstance(student.applicant_count, int) or student.applicant_count < 0:
            return {'valid': False, 'message': '求职者次数必须是非负整数'}

    # 验证资金字段（如果有提供）
    if student.funds is not None:
        if not isinstance(student.funds, (int, float)):
            return {'valid': False, 'message': '资金必须是数值型'}

    # 验证排名字段（如果有提供）
    if student.ranking is not None:
        if not isinstance(student.ranking, int):
            return {'valid': False, 'message': '排名必须是整数'}

    return {'valid': True, 'message': '验证通过'}


# ==================== Services ====================
class StudentService:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.file_path = os.path.join(base_dir, 'data', 'students.json')  # 统一信息存储文件
        self.students = self.load_students()

    def load_students(self) -> List[Student]:
        """从文件加载学生数据"""
        if not os.path.exists(self.file_path):
            return []
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                students_list = []

                for item in data:
                    student = Student.from_dict(item)
                    students_list.append(student)

                return students_list
        except Exception as e:
            print(f"加载学生数据失败: {e}")
            return []

    def save_students(self):
        """保存学生数据到文件"""
        try:
            # 更新排名
            update_rankings(self.students, ascending=False)  # 资金多的排名靠前

            # 保存完整信息到 students.json
            full_data = [s.to_full_dict() for s in self.students]
            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump(full_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"保存学生数据失败: {e}")

    def create_student(self, student: Student) -> bool:
        """创建学生记录"""
        # 验证数据
        validation_result = validate_student_data(student)
        if not validation_result['valid']:
            print(f"数据验证失败: {validation_result['message']}")
            return False

        # 检查学号是否已存在
        if any(s.student_id == student.student_id for s in self.students):
            print("学号已存在")
            return False

        # 添加新学生
        self.students.append(student)
        self.save_students()
        print("学生信息创建成功")
        return True

    def get_student_by_id(self, student_id: str) -> Optional[Student]:
        """根据学号查询学生"""
        for student in self.students:
            if student.student_id == student_id:
                return student
        return None

    def get_all_students(self) -> List[Student]:
        """获取所有学生"""
        return self.students.copy()

    def get_students_sorted_by_funds(self, ascending: bool = False) -> List[Student]:
        """
        根据资金数量获取排序后的学生列表

        Args:
            ascending: True为升序，False为降序（默认）

        Returns:
            排序后的学生列表
        """
        return sort_students_by_funds(self.students, ascending)

    def update_student(self, student: Student) -> bool:
        """更新学生信息"""
        # 验证数据
        validation_result = validate_student_data(student)
        if not validation_result['valid']:
            print(f"数据验证失败: {validation_result['message']}")
            return False

        # 查找并替换
        for i, s in enumerate(self.students):
            if s.student_id == student.student_id:
                student.updated_at = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
                self.students[i] = student
                self.save_students()
                print("学生信息更新成功")
                return True
        print("学生不存在")
        return False

    def delete_student(self, student_id: str) -> bool:
        """删除学生记录"""
        original_count = len(self.students)
        self.students = [s for s in self.students if s.student_id != student_id]

        if len(self.students) < original_count:
            self.save_students()
            print("学生信息删除成功")
            return True
        else:
            print("学生不存在")
            return False

    def search_students(self, keyword: str) -> List[Student]:
        """根据关键字搜索学生（姓名或专业）"""
        results = []
        for student in self.students:
            if (keyword.lower() in student.name.lower() or
                    keyword.lower() in student.major.lower()):
                results.append(student)
        return results


# ==================== CLI Interface ====================
def print_menu():
    """打印菜单"""
    print("\n=== 学生信息管理系统 ===")
    print("1. 添加学生")
    print("2. 查询学生")
    print("3. 显示所有学生")
    print("4. 更新学生信息")
    print("5. 删除学生")
    print("6. 搜索学生")
    print("0. 退出系统")
    print("=" * 25)


def add_student(service: StudentService):
    """添加学生"""
    print("\n--- 添加学生 ---")
    try:
        student_id = input("学号: ")
        name = input("姓名: ")
        gender = input("性别 (男/女): ") or "男"
        birth_date = input("出生日期 (YYYY-MM-DD, 可选): ") or None
        major = input("专业: ") or "未知专业"
        enrollment_input = input("入学年份: ")
        enrollment_year = int(enrollment_input) if enrollment_input else 2020
        phone = input("电话 (可选): ") or None
        email = input("邮箱 (可选): ") or None
        address = input("地址 (可选): ") or None

        interviewer_input = input("作为面试官次数 (默认0): ")
        interviewer_count = int(interviewer_input) if interviewer_input else 0

        applicant_input = input("作为求职者次数 (默认0): ")
        applicant_count = int(applicant_input) if applicant_input else 0

        funds_input = input("资金 (默认0.0): ")
        funds = float(funds_input) if funds_input else 0.0

        student = Student(
            student_id=student_id,
            name=name,
            gender=gender,
            birth_date=birth_date,
            major=major,
            enrollment_year=enrollment_year,
            phone=phone,
            email=email,
            address=address,
            interviewer_count=interviewer_count,
            applicant_count=applicant_count,
            funds=funds
        )

        if service.create_student(student):
            print("学生添加成功!")
        else:
            print("学生添加失败!")
    except ValueError as e:
        print(f"输入数据格式错误: {e}")
    except Exception as e:
        print(f"添加学生时出错: {e}")


def query_student(service: StudentService):
    """查询学生"""
    print("\n--- 查询学生 ---")
    student_id = input("请输入学号: ")
    student = service.get_student_by_id(student_id)

    if student:
        print(f"\n学号: {student.student_id}")
        print(f"姓名: {student.name}")
        print(f"性别: {student.gender}")
        print(f"出生日期: {student.birth_date or '未填写'}")
        print(f"专业: {student.major}")
        print(f"入学年份: {student.enrollment_year}")
        print(f"电话: {student.phone or '未填写'}")
        print(f"邮箱: {student.email or '未填写'}")
        print(f"地址: {student.address or '未填写'}")
        print(f"作为面试官次数: {student.interviewer_count}")
        print(f"作为求职者次数: {student.applicant_count}")
        print(f"资金: {student.funds}")
        print(f"排名: {student.ranking or '未排名'}")
        print(f"创建时间: {student.created_at}")
        print(f"更新时间: {student.updated_at}")
    else:
        print("未找到该学生!")


def list_all_students(service: StudentService):
    """显示所有学生"""
    print("\n--- 所有学生信息 ---")
    students = service.get_all_students()

    if not students:
        print("暂无学生信息")
        return

    print(
        f"{'学号':<12} {'姓名':<10} {'性别':<4} {'专业':<20} {'入学年份':<8} {'面试官次数':<10} {'求职者次数':<10} {'资金':<10}")
    print("-" * 100)

    for student in students:
        print(f"{student.student_id:<12} {student.name:<10} {student.gender:<4} "
              f"{student.major:<20} {student.enrollment_year:<8} {student.interviewer_count:<10} "
              f"{student.applicant_count:<10} {student.funds:<10}")


def update_student(service: StudentService):
    """更新学生信息"""
    print("\n--- 更新学生信息 ---")
    student_id = input("请输入要更新的学生学号: ")
    student = service.get_student_by_id(student_id)

    if not student:
        print("未找到该学生!")
        return

    print(f"当前学生信息: {student}")
    print("请输入新的信息（直接回车保持原值）:")

    try:
        name = input(f"姓名 ({student.name}): ") or student.name
        gender = input(f"性别 ({student.gender}): ") or student.gender
        birth_date = input(f"出生日期 ({student.birth_date or '未填写'}): ") or student.birth_date
        major = input(f"专业 ({student.major}): ") or student.major
        enrollment_input = input(f"入学年份 ({student.enrollment_year}): ")
        enrollment_year = int(enrollment_input) if enrollment_input else student.enrollment_year
        phone = input(f"电话 ({student.phone or '未填写'}): ") or student.phone
        email = input(f"邮箱 ({student.email or '未填写'}): ") or student.email
        address = input(f"地址 ({student.address or '未填写'}): ") or student.address
        interviewer_count = input(f"作为面试官次数 ({student.interviewer_count}): ")
        interviewer_count = int(interviewer_count) if interviewer_count else student.interviewer_count
        applicant_count = input(f"作为求职者次数 ({student.applicant_count}): ")
        applicant_count = int(applicant_count) if applicant_count else student.applicant_count
        funds = input(f"资金 ({student.funds}): ")
        funds = float(funds) if funds else student.funds

        updated_student = Student(
            student_id=student_id,
            name=name,
            gender=gender,
            birth_date=birth_date,
            major=major,
            enrollment_year=enrollment_year,
            phone=phone,
            email=email,
            address=address,
            interviewer_count=interviewer_count,
            applicant_count=applicant_count,
            funds=funds
        )

        if service.update_student(updated_student):
            print("学生信息更新成功!")
        else:
            print("学生信息更新失败!")
    except ValueError:
        print("入学年份、面试官次数、求职者次数必须是数字!")
    except Exception as e:
        print(f"更新学生信息时出错: {e}")


def delete_student(service: StudentService):
    """删除学生"""
    print("\n--- 删除学生 ---")
    student_id = input("请输入要删除的学生学号: ")

    # 先查询学生信息
    student = service.get_student_by_id(student_id)
    if not student:
        print("未找到该学生!")
        return

    print(f"将要删除的学生信息: {student}")
    confirm = input("确认删除吗? (y/N): ")

    if confirm.lower() == 'y':
        if service.delete_student(student_id):
            print("学生删除成功!")
        else:
            print("学生删除失败!")
    else:
        print("取消删除操作")


def search_students(service: StudentService):
    """搜索学生"""
    print("\n--- 搜索学生 ---")
    keyword = input("请输入搜索关键字（姓名或专业）: ")
    students = service.search_students(keyword)

    if not students:
        print("未找到匹配的学生!")
        return

    print(f"\n找到 {len(students)} 个匹配的学生:")
    print(f"{'学号':<12} {'姓名':<10} {'性别':<4} {'专业':<20} {'入学年份':<8} {'面试官次数':<10} {'求职者次数':<10}")
    print("-" * 85)

    for student in students:
        print(f"{student.student_id:<12} {student.name:<10} {student.gender:<4} "
              f"{student.major:<20} {student.enrollment_year:<8} {student.interviewer_count:<10} "
              f"{student.applicant_count:<10}")


def cli_main():
    """CLI主函数"""
    # 确保data目录存在
    if not os.path.exists('data'):
        os.makedirs('data')

    # 确保students.json文件存在
    if not os.path.exists('data/students.json'):
        with open('data/students.json', 'w', encoding='utf-8') as f:
            f.write('[]')

    service = StudentService()

    while True:
        print_menu()
        choice = input("请选择操作: ")

        if choice == '1':
            add_student(service)
        elif choice == '2':
            query_student(service)
        elif choice == '3':
            list_all_students(service)
        elif choice == '4':
            update_student(service)
        elif choice == '5':
            delete_student(service)
        elif choice == '6':
            search_students(service)
        elif choice == '0':
            print("感谢使用学生信息管理系统!")
            break
        else:
            print("无效选择，请重新输入!")


# ==================== Web API ====================
# 创建Flask应用




def api_response(code=200, message="success", data=None):
    """统一API响应格式"""
    response = {
        "code": code,
        "message": message
    }
    # 只有当data不为None时才添加data字段
    if data is not None:
        response["data"] = data
    return jsonify(response)


# API路由
@students_bp.route('/api/students', methods=['GET'])
def get_all_students():
    """获取所有学生"""
    try:
        student_service = StudentService()
        # 检查是否有排序参数
        sort_by = request.args.get('sort_by', '')  # funds
        order = request.args.get('order', 'desc')  # asc 或 desc

        if sort_by == 'funds':
            ascending = order.lower() == 'asc'
            students = student_service.get_students_sorted_by_funds(ascending)
        else:
            students = student_service.get_all_students()

        students_data = [student.to_dict() for student in students]
        return api_response(data=students_data)
    except Exception as e:
        return api_response(500, f"服务器内部错误: {str(e)}")


@students_bp.route('/api/students/<string:student_id>', methods=['GET'])
def get_student(student_id):
    """根据学号获取学生"""
    try:
        # 检查是否有查询参数 detail=true
        detail = request.args.get('detail', 'false').lower() == 'true'
        student_service = StudentService()
        student = student_service.get_student_by_id(student_id)
        if student:
            if detail:
                # 返回完整信息
                return api_response(data=student.to_full_dict())
            else:
                # 返回简化信息
                return api_response(data=student.to_dict())
        else:
            return api_response(200, "学生不存在")
    except Exception as e:
        return api_response(500, f"服务器内部错误: {str(e)}")


@students_bp.route('/api/students/sort/funds', methods=['GET'])
def get_students_sorted_by_funds():
    """按资金金额排序获取学生列表"""
    try:
        student_service = StudentService()
        # 获取排序参数，默认降序
        order = request.args.get('order', 'desc')  # asc 或 desc
        ascending = order.lower() == 'asc'

        # 获取详细信息参数
        detail = request.args.get('detail', 'false').lower() == 'true'

        # 获取学生列表并按资金排序
        students = student_service.get_students_sorted_by_funds(ascending)

        if detail:
            students_data = [student.to_full_dict() for student in students]
        else:
            students_data = [student.to_dict() for student in students]

        return api_response(data=students_data)
    except Exception as e:
        return api_response(500, f"服务器内部错误: {str(e)}")


@students_bp.route('/api/students', methods=['POST'])
def create_student():
    """创建学生"""
    try:
        student_service = StudentService()
        data = request.get_json()

        # 创建学生对象，包含新字段
        student = Student(
            student_id=data.get('student_id'),
            name=data.get('name'),
            gender=data.get('gender'),
            major=data.get('major'),
            enrollment_year=data.get('enrollment_year'),
            birth_date=data.get('birth_date'),
            phone=data.get('phone'),
            email=data.get('email'),
            address=data.get('address'),
            status=data.get('status', '活跃'),
            interviewer_count=data.get('interviewer_count', 0),  # 面试官次数
            applicant_count=data.get('applicant_count', 0),  # 求职者次数
            funds=data.get('funds', 0.0),  # 资金
            ranking=data.get('ranking')  # 排名
        )

        # 保存学生
        if student_service.create_student(student):
            response = api_response(200, "创建成功", student.to_dict())
            response.status_code = 200
            return response
        else:
            return api_response(400, "创建学生失败，学号可能已存在，或者信息有误")
    except Exception as e:
        return api_response(500, f"服务器内部错误: {str(e)}")


@students_bp.route('/api/students/<string:student_id>', methods=['PUT'])
def update_student_api(student_id):
    """更新学生信息"""
    try:
        student_service = StudentService()
        data = request.get_json()

        # 创建学生对象，包含新字段
        student = Student(
            student_id=student_id,  # 使用URL中的ID
            name=data.get('name'),
            gender=data.get('gender'),
            major=data.get('major'),
            enrollment_year=data.get('enrollment_year'),
            birth_date=data.get('birth_date'),
            phone=data.get('phone'),
            email=data.get('email'),
            address=data.get('address'),
            status=data.get('status', '活跃'),
            interviewer_count=data.get('interviewer_count', 0),  # 面试官次数
            applicant_count=data.get('applicant_count', 0),  # 求职者次数
            funds=data.get('funds', 0.0),  # 资金
            ranking=data.get('ranking')  # 排名
        )

        # 更新学生
        if student_service.update_student(student):
            return api_response(data=student.to_dict())
        else:
            return api_response(200, "更新学生失败，学生可能不存在")
    except Exception as e:
        return api_response(500, f"服务器内部错误: {str(e)}")


@students_bp.route('/api/students/<string:student_id>', methods=['DELETE'])
def delete_student_api(student_id):
    """删除学生"""
    try:
        student_service = StudentService()
        if student_service.delete_student(student_id):
            return api_response(message="学生删除成功")

        else:
            return api_response(200, "删除学生失败，学生可能不存在")
    except Exception as e:
        return api_response(500, f"服务器内部错误: {str(e)}")


@students_bp.route('/api/students/search', methods=['GET'])
def search_students_api():
    """搜索学生"""
    try:
        student_service = StudentService()
        keyword = request.args.get('keyword', '')
        detail = request.args.get('detail', 'false').lower() == 'true'

        if not keyword:
            students = student_service.get_all_students()
        else:
            students = student_service.search_students(keyword)

        if detail:
            students_data = [student.to_full_dict() for student in students]
        else:
            students_data = [student.to_dict() for student in students]
        return api_response(data=students_data)
    except Exception as e:
        return api_response(500, f"服务器内部错误: {str(e)}")


@students_bp.route('/api/students/refresh-data', methods=['GET'])
def refresh_data():
    """删除学生"""
    try:
        student_service = StudentService()
        total_list = student_service.get_all_students()
        new_list = copy.deepcopy(total_list)
        for student in new_list:

            student.funds = 0
            student.interviewer_count = 0
            student.applicant_count = 0
            student_service.update_student(student)


        return api_response(200, "刷成功")
    except Exception as e:
        error_traceback = traceback.format_exc()  # 获取完整的错误堆栈
        print(f"Error occurred: {error_traceback}")  # 打印完整堆栈信息
        return api_response(500, f"服务器内部错误: {str(e)}")


# 健康检查接口
@students_bp.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return api_response(message="学生信息管理系统API运行正常")


# 根路径
@students_bp.route('/')
def index():
    """网站主页"""
    return api_response(message="欢迎使用学生信息管理系统API")


# 错误处理
@students_bp.errorhandler(404)
def not_found(error):
    return api_response(404, "接口不存在")


@students_bp.errorhandler(500)
def internal_error(error):
    return api_response(500, "服务器内部错误")
