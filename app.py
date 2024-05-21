#-----------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See LICENSE in the project root for license information.
#-----------------------------------------------------------------------------------------

from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!22'

@app.route('/greet/<name>')
def greet(name):
    return 'Hello, {}!'.format(name)

@app.route('/login', methods=['GET', 'POST'])
def login():
    code = request.args.get('code')  # 从请求中获取小程序发送的 code

    # 使用微信 API 获取 session 信息
    url = 'https://api.weixin.qq.com/sns/jscode2session'
    params = {
        'appid': '你的小程序的 AppID',
        'secret': '你的小程序的 AppSecret',
        'js_code': code,
        'grant_type': 'authorization_code'
    }
    r = requests.get(url, params=params)
    res = r.json()

    # 在这里，你可以使用获取到的 session 信息进行进一步的处理，
    # 例如创建用户，生成 token 等。

    return res  # 将结果返回给小程序

if __name__ == '__main__':
    app.run()
