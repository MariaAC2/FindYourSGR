# from flask import Flask, request, jsonify
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import select
# from flask_bcrypt import Bcrypt
# from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
# import sqlite3
# from flask_cors import CORS
# import json
# from firebase_admin import credentials, initialize_app
import pyrebase

config ={
    'apiKey': "AIzaSyBcbB4IhjxvFZ2O9g6jdoCK29FVMuLYMVw",
    'authDomain': "proiect-isi5.firebaseapp.com",
    'projectId': "proiect-isi5",
    'storageBucket': "proiect-isi5.firebasestorage.app",
    'messagingSenderId': "574178823412",
    'appId': "1:574178823412:web:62fc1ebfc9cba6905862a1",
    'measurementId': "G-0YFYTBZP4P",
    'databaseURL': ""
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

email = 'test@gmail.com'
password = '123456'

user = auth.sign_in_with_email_and_password(email, password)

auth.send_email_verification(user['idToken'])

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes by default

# DATABASE = 'tasks.db'

# # Configurare bază de date locală
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DATABASE
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)

# class SGR_point(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(50), nullable=False)
#     description = db.Column(db.String(200), nullable=False)
#     size_of_queue = db.Column(db.Integer, nullable=True, default=0)
#     working = db.Column(db.Boolean, default=False)
#     coordinate_x = db.Column(db.Float, nullable=False)
#     coordinate_y = db.Column(db.Float, nullable=False)
    
#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}

# class User(db.Model, UserMixin):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(70), nullable=False, unique=True)
#     password_hash = db.Column(db.String(128), nullable=False)  # Hash of the password
#     sgr_points = db.Column(db.Integer, nullable=False, default=0)
    
#     favourite_sgr_point_id = db.Column(db.Integer, db.ForeignKey('sgr_point.id'), nullable=True)
#     favourite_sgr_point = db.relationship('SGR_point', backref='favourite_users', lazy=True)

#     def set_password(self, password):
#         """Hashes the password and sets the password_hash field."""
#         self.password_hash = generate_password_hash(password)

#     def check_password(self, password):
#         """Verifies the provided password against the stored hash."""
#         return check_password_hash(self.password_hash, password)

#     def as_dict(self):
#         """Converts the object to a dictionary excluding the password_hash."""
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name != 'password_hash'}
#     def __repr__(self):
#         return f"User('{self.username}')"
    
# with app.app_context():
#     db.create_all()

# def load_user(user_id):
#     return User.query.get(int(user_id))

# def get_db_connection():
#     conn = sqlite3.connect("instance/" + DATABASE)
#     conn.row_factory = sqlite3.Row
#     return conn

# #Login stuff

# @app.route("/register", methods=['GET', 'POST'])
# def register():
#     form = RegistrationForm()
#     if form.validate_on_submit():
#         hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
#         user = User(username=form.username.data, email=form.email.data, password=hashed_password)
#         db.session.add(user)
#         db.session.commit()
#         flash('Your account has been created! You can now log in.', 'success')
#         return redirect(url_for('login'))
#     return render_template('register.html', form=form)

# @app.route("/login", methods=['GET', 'POST'])
# def login():
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.query.filter_by(email=form.email.data).first()
#         if user and bcrypt.check_password_hash(user.password, form.password.data):
#             login_user(user, remember=form.remember.data)
#             return redirect(url_for('dashboard'))
#         else:
#             flash('Login unsuccessful. Please check email and password.', 'danger')
#     return render_template('login.html', form=form)

# @app.route("/dashboard")
# @login_required
# def dashboard():
#     return render_template('dashboard.html')

# @app.route("/logout")
# def logout():
#     logout_user()
#     return redirect(url_for('login'))

# @app.route('/')
# def index(): 
#     return "Lab6 Backend Server"

# @app.route('/addSGRPoint', methods=['POST'])
# def add_SGR_point():
#     from flask import request, jsonify

#     data = request.json
#     if not data:
#         return jsonify({"error": "Invalid or missing JSON payload"}), 400

#     title = data.get('title')
#     description = data.get('description')
#     coordinate_x = data.get('coordinate_x')
#     coordinate_y = data.get('coordinate_y')

#     if not all([title, description, coordinate_x, coordinate_y]):
#         return jsonify({"error": "Missing required fields: title, description, coordinate_x, coordinate_y"}), 400

#     size_of_queue = data.get('size_of_queue', 0)
#     working = data.get('working', False)

#     new_point = SGR_point(
#         title=title,
#         description=description,
#         coordinate_x=coordinate_x,
#         coordinate_y=coordinate_y,
#         size_of_queue=size_of_queue,
#         working=working
#     )

#     try:
#         db.session.add(new_point)
#         db.session.commit()
#         return jsonify({
#             "message": "SGR_point added successfully",
#             "point": new_point.as_dict()
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": f"Failed to add SGR_point: {str(e)}"}), 500

# @app.route('/modifySGRCoord', methods=['POST'])
# def set_SGR_point():
#     data = request.json
#     if not data:
#         return jsonify({"error": "Invalid or missing JSON payload"}), 400

#     point_id = data.get('id')
#     new_x = data.get('x')
#     new_y = data.get('y')

#     if point_id is None or new_x is None or new_y is None:
#         return jsonify({"error": "Missing required fields: id, x, and y"}), 400

#     sgr_point = SGR_point.query.get(point_id)
#     if sgr_point is None:
#         return jsonify({"error": "SGR_point not found"}), 404

#     sgr_point.coordinate_x = new_x
#     sgr_point.coordinate_y = new_y

#     try:
#         db.session.commit()
#         return jsonify({"message": "SGR_point updated successfully", "point": sgr_point.as_dict()}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": f"Failed to update SGR_point: {str(e)}"}), 500

# @app.route('/incrementQueue', methods=['POST'])
# def increment_queue():
#     data = request.json
#     if not data:
#         return jsonify({"error": "Invalid or missing JSON payload"}), 400

#     point_id = data.get('id')

#     if point_id is None:
#         return jsonify({"error": "Missing required field: id"}), 400

#     sgr_point = SGR_point.query.get(point_id)
#     if sgr_point is None:
#         return jsonify({"error": "SGR_point not found"}), 404

#     try:
#         sgr_point.size_of_queue = (sgr_point.size_of_queue or 0) + 1
#         db.session.commit()
#         return jsonify({
#             "message": "Queue size incremented successfully",
#             "point": sgr_point.as_dict()
#         }), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": f"Failed to increment queue size: {str(e)}"}), 500

# @app.route('/findSGRPointByName', methods=['GET'])
# def find_SGR_point_by_name():
#     title = request.args.get('title')
    
#     if not title:
#         return jsonify({"error": "Missing required query parameter: title"}), 400

#     try:
#         sgr_points = SGR_point.query.filter_by(title=title).all()
#         if not sgr_points:
#             return jsonify({"error": "No SGR_point found with the given title"}), 404

#         return jsonify({
#             "message": f"{len(sgr_points)} SGR_point(s) found",
#             "points": [point.as_dict() for point in sgr_points]
#         }), 200
#     except Exception as e:
#         return jsonify({"error": f"Failed to find SGR_point by name: {str(e)}"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
