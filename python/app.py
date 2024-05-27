#-----------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See LICENSE in the project root for license information.
#-----------------------------------------------------------------------------------------

from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import requests
from functools import wraps

import pymysql
pymysql.install_as_MySQLdb()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:abc12345@localhost/flask_test'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    openid = db.Column(db.String(250), nullable=False)
    code = db.Column(db.String(250), nullable=False)
    token = db.Column(db.String(250), nullable=False)
    role = db.Column(db.Integer, nullable=False)  # 用户角色

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        user = User.query.filter_by(token=token).first()
        if user is None:
            return jsonify({'message': 'Unauthorized'}), 401
        g.user = user
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user.role != 1:
            return jsonify({'message': 'Forbidden'}), 403
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login2', methods=['GET'])
@login_required
@admin_required
def login2():
    return jsonify({'message': 'Welcome, admin!'})

@app.route('/')
def home():
    return send_from_directory('static', 'index.html')

@app.route('/greet/<name>')
def greet(name):
    return 'Hello, {}!'.format(name)

@app.route('/login', methods=['GET', 'POST'])
def login():
    code = request.args.get('code')
    code = request.get_json().get('code') if code == None else code  # 从请求中获取小程序发送的 code

    # 使用微信 API 获取 session 信息
    url = 'https://api.weixin.qq.com/sns/jscode2session'
    params = {
        'appid': 'wxb7c7f86e6e51841a',
        'secret': '04cde389c9a63868b7bf9fe0504aa57f',
        'js_code': code,
        'grant_type': 'authorization_code'
    }
    r = requests.get(url, params=params)
    res = r.json()

    # 在这里，你可以使用获取到的 session 信息进行进一步的处理，
    # 例如创建用户，生成 token 等。
    if 'openid' in res:
        # 登录成功
        return jsonify({'status': 'success'}), 200
    else:
        # 登录失败
        return jsonify({'status': 'fail'}), 400

if __name__ == '__main__':
    app.run()
