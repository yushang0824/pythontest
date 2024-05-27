from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from functools import wraps

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/dbname'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80), nullable=False)
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

@app.route('/admin', methods=['GET'])
@login_required
@admin_required
def admin():
    return jsonify({'message': 'Welcome, admin!'})