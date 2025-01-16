from flask import Flask, session, render_template, request, redirect, jsonify
import pyrebase
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])


config ={
    'apiKey': "AIzaSyBcbB4IhjxvFZ2O9g6jdoCK29FVMuLYMVw",
    'authDomain': "proiect-isi5.firebaseapp.com",
    'projectId': "proiect-isi5",
    'storageBucket': "proiect-isi5.firebasestorage.app",
    'messagingSenderId': "574178823412",
    'appId': "1:574178823412:web:62fc1ebfc9cba6905862a1",
    'measurementId': "G-0YFYTBZP4P",
    'databaseURL': "https://proiect-isi5-default-rtdb.europe-west1.firebasedatabase.app/"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

app.secret_key = 'secret_mare'


class SGRPoint:
    def __init__(self, point_id, title, description, size_of_queue, working, coordinate_x, coordinate_y):
        self.id = point_id
        self.title = title
        self.description = description
        self.size_of_queue = size_of_queue
        self.working = working
        self.coordinate_x = coordinate_x
        self.coordinate_y = coordinate_y

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "size_of_queue": self.size_of_queue,
            "working": self.working,
            "coordinate_x": self.coordinate_x,
            "coordinate_y": self.coordinate_y,
        }

@app.route('/')
def home():
    if 'user' in session:
        return render_template('dashboard.html', user=session['user'])
    return 'Welcome! Please <a href="/login">login</a> or <a href="/register">register</a>.'



# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     error = None
#     if request.method == 'POST':
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')
#         print(f"got user with email {email} and password {password}")
#         try:
#             user = auth.create_user_with_email_and_password(email, password)
#             session['user'] = email
#             return jsonify({"message": "User registered successfully"}), 201
#         except Exception as e:
#             error = 'User already exists. Please try another email.'
    
#     return render_template('register.html', error=error)
@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        try:
            data = request.get_json()  # Parse JSON from request
            email = data.get('email')
            password = data.get('password')
            
            # Debugging log
            print(f"Received user with email {email} and password {password}")
            
            # Create the user in Firebase
            user = auth.create_user_with_email_and_password(email, password)
            session['user'] = email
            
            # Respond with a success message
            return jsonify({"message": "User registered successfully!"}), 201
        
        except Exception as e:
            # Respond with an error message
            error_message = str(e)
            print(f"Error during registration: {error_message}")
            return jsonify({"error": "User already exists or invalid details.", "details": error_message}), 400


@app.route('/edit_point/<point_id>', methods=['GET', 'POST'])
def edit_point(point_id):
    if 'user' not in session:
        return redirect('/login')
    
    try:
        point_data = db.child("SGRPoints").order_by_child("id").equal_to(point_id).get()

        if not point_data.val():
            return "Point not found."
        
        point = point_data.val()
        key = list(point.keys())[0]

        if request.method == 'POST':
            updated_title = request.form.get('title')
            updated_description = request.form.get('description')
            updated_size_of_queue = int(request.form.get('size_of_queue'))
            updated_working = request.form.get('working')
            updated_coordinate_x = float(request.form.get('coordinate_x'))
            updated_coordinate_y = float(request.form.get('coordinate_y'))

            updated_point = {
                "id": point_id,
                "title": updated_title,
                "description": updated_description,
                "size_of_queue": updated_size_of_queue,
                "working": updated_working,
                "coordinate_x": updated_coordinate_x,
                "coordinate_y": updated_coordinate_y
            }

            db.child("SGRPoints").child(key).update(updated_point)

            return redirect('/view_points')

        return render_template('edit_point.html', point=point[key])

    except Exception as e:
        return "Error editing point: " + str(e)


# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     error = None
#     if request.method == 'POST':
#         email = request.form.get('email')
#         password = request.form.get('password')
        
#         try:
#             user = auth.sign_in_with_email_and_password(email, password)
#             session['user'] = email
#             return redirect('/')
#         except:
#             error = 'Incorrect email or password. Please try again.'
    
#     return render_template('login.html', error=error)
@app.route('/login', methods=['POST'])
def login():
    try:
        # Parse JSON data from the request body
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Debugging log to ensure data is received
        print(f"Attempting login with email: {email}")

        # Attempt to authenticate the user with Firebase
        user = auth.sign_in_with_email_and_password(email, password)
        session['user'] = email

        # Send a success response
        return jsonify({"message": "Login successful!", "email": email}), 200

    except Exception as e:
        # Handle login errors and return a JSON response
        error_message = str(e)
        print(f"Login error: {error_message}")
        return jsonify({"error": "Invalid email or password.", "details": error_message}), 401


@app.route('/logout')
def logout():
    session.pop('user')
    return redirect('/')

@app.route('/add_point', methods=['GET', 'POST'])
def add_point():
    error = None
    if 'user' not in session:
        return redirect('/login')
    
    if request.method == 'POST':
        try:
            point_id = request.form.get('id')
            title = request.form.get('title')
            description = request.form.get('description')
            size_of_queue = int(request.form.get('size_of_queue'))
            working = request.form.get('working')
            coordinate_x = float(request.form.get('coordinate_x'))
            coordinate_y = float(request.form.get('coordinate_y'))
            
            sgr_point = SGRPoint(
                point_id=point_id,
                title=title,
                description=description,
                size_of_queue=size_of_queue,
                working=working,
                coordinate_x=coordinate_x,
                coordinate_y=coordinate_y
            )
            # Save to Firebase
            db.child("SGRPoints").push(sgr_point.to_dict())
            return "Point added successfully!"
        except Exception as e:
            error = "Failed to add point: " + str(e)
    
    return render_template('add_point.html', error=error)

@app.route('/view_points')
def view_points():
    if 'user' not in session:
        return redirect('/login')
    
    try:
        points = db.child("SGRPoints").get()
        if points.val():
            return render_template('view_points.html', points=points.val())
        else:
            return "No points available."
    except Exception as e:
        return "Error retrieving points: " + str(e)

if __name__ == '__main__':
    app.run(port= 1111)