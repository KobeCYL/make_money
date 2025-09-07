from flask import Blueprint, request, jsonify, abort
import json

user_bp = Blueprint('user', __name__)

@user_bp.route('/currentUser', methods=['GET'])
def current_user():
    token = request.args.get('token')
    
    # 这里应该添加实际的用户验证逻辑
    if token == '123':
        return jsonify({
            'success': True,
            'data': {
                'name': 'Admin User',
                'avatar': 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                'userid': '00000001',
                'email': 'admin@example.com',
                'signature': '海纳百川，有容乃大',
                'title': '交互专家',
                'group': '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
                'tags': [
                    {'key': '0', 'label': '很有想法的'},
                    {'key': '1', 'label': '专注设计'},
                    {'key': '2', 'label': '辣~'},
                    {'key': '3', 'label': '大长腿'},
                    {'key': '4', 'label': '川妹子'},
                    {'key': '5', 'label': '海纳百川'}
                ],
                'notifyCount': 12,
                'unreadCount': 11,
                'country': 'China',
                'access': 'admin',
                'geographic': {
                    'province': {'label': '浙江省', 'key': '330000'},
                    'city': {'label': '杭州市', 'key': '330100'}
                },
                'address': '西湖区工专路 77 号',
                'phone': '0752-268888888'
            }
        })
    else:
        return jsonify({
            'success': False,
            'data': {
                'message': 'Invalid token'
            }
        }), 401

@user_bp.route('/login/account', methods=['POST'])
def login():
    data = request.get_json()
    token = request.args.get('token')
    
    # 这里应该添加实际的登录验证逻辑
    if token == '123':
        return jsonify({
            'status': 'ok',
            'type': 'account',
            'currentAuthority': 'admin'
        })
    else:
        return jsonify({
            'status': 'error',
            'type': 'account',
            'currentAuthority': 'guest'
        }), 401

@user_bp.route('/user', methods=['GET'])
def user():
    return jsonify({
        'status': '200',
        'msg': 'user_bp'
    })


    