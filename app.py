from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select
import sqlite3
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes by default

DATABASE = 'tasks.db'

# Configurare bază de date locală
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelul Task (pentru TODO-uri)
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class SGR_point(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    size_of_queue = db.Column(db.Integer, nullable=True, default=0)
    working = db.Column(db.Boolean, default=False)
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(70), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)  # Hash of the password
    sgr_points = db.Column(db.Integer, nullable=False, default=0)
    
    favourite_sgr_point_id = db.Column(db.Integer, db.ForeignKey('sgr_point.id'), nullable=True)
    favourite_sgr_point = db.relationship('SGR_point', backref='favourite_users', lazy=True)

    def set_password(self, password):
        """Hashes the password and sets the password_hash field."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifies the provided password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def as_dict(self):
        """Converts the object to a dictionary excluding the password_hash."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name != 'password_hash'}

with app.app_context():
    db.create_all()

def get_db_connection():
    conn = sqlite3.connect("instance/" + DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index(): 
    return "Lab6 Backend Server"

# TODO 1: Endpoint pentru a adăuga un task nou (POST)
@app.route('/tasks', methods=['POST'])
def add_task():
    """Adaugă un task nou în baza de date."""
    # Logica pentru a adăuga un task nou va fi aici  
    if 'title' not in request.json:
        return jsonify({"status": False, "error": "Title is required"}), 400

    req_title = request.json["title"]
    existing_task = db.session.query(Task).filter(Task.title == request.json["title"]).first()

    if existing_task:
        return jsonify({"status": False, "message": "A task with this title already exists."}), 400
    
    if 'description' in request.json:
        req_description = request.json["description"]
        existing_task = db.session.query(Task).filter(Task.description == request.json["description"]).first()

        if existing_task:
            return jsonify({"status": False, "message": "A task with this description already exists."}), 400
    
    task = Task(
        title=req_title,
        description=req_description if "description" in request.json else None
    )

    db.session.add(task)
    db.session.commit()
    return jsonify({"status": True})

# TODO 2: Endpoint pentru a obține toate task-urile (GET)
@app.route('/tasks', methods=['GET'])
def get_all_tasks():
    """Obține toate task-urile din baza de date."""
    # Logica pentru a returna toate task-urile va fi aici
    tasks = db.session.execute(select(Task.id, Task.title, Task.description, Task.completed)).all()
    tasks_dict = [task._asdict() for task in tasks]
    return jsonify({"status": True, "data": tasks_dict})

@app.route('/tasks/select', methods=['GET'])
def get_all_tasks_select():
    """Obține toate task-urile din baza de date. (folosing sintaxa nativă SQL)"""
    with get_db_connection() as conn:
        tasks = conn.execute("SELECT * FROM Task").fetchall()
        tasks_list = [dict(task) for task in tasks]
    return jsonify({"status": True, "data": tasks_list})

# TODO 3: Endpoint pentru a obține un task după id (GET)
@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Obține un task pe baza ID-ului."""
    # Logica pentru a obține un task după id va fi aici
    task = db.session.execute(select(Task.id, Task.title, Task.description, Task.completed).where(Task.id==task_id)).one()._asdict()
    return jsonify({"status": True, "data": task})

@app.route('/tasks/select/<int:task_id>', methods=['GET'])
def get_task_select(task_id):
    """Obține un task pe baza ID-ului."""
    with get_db_connection() as conn:
        task = conn.execute("SELECT * FROM Task WHERE id = ?", (task_id,)).fetchone()
        if task:
            return jsonify({"status": True, "data": dict(task)})
        else:
            return jsonify({"status": False, "error": "Task not found"}), 404

# TODO 4: Endpoint pentru a actualiza un task (PUT)
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Actualizează un task existent."""
    task = db.session.get(Task, task_id)
    
    if not task:
        return jsonify({"status": False, "message": "Task not found"}), 404

    # Update the task's attributes
    task.title = request.json["title"]
    task.description = request.json["description"]

    # Commit the changes to the database
    db.session.commit()
    # Logica pentru a actualiza un task va fi aici
    return jsonify({"status": True, "data": task.as_dict()})


# TODO 5: Endpoint pentru a șterge un task (DELETE)
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Șterge un task pe baza ID-ului."""
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"status": False, "message": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    # Logica pentru a șterge un task va fi aici
    return jsonify({"status": True})

# TODO 6: Endpoint pentru a marca un task ca finalizat (PATCH)
@app.route('/tasks/<int:task_id>/complete', methods=['PATCH'])
def complete_task(task_id):
    """Marchează un task ca finalizat."""
    task = db.session.get(Task, task_id)

    if not task:
        return jsonify({"status": False, "message": "Task not found"}), 404
    
    task.completed = True
    db.session.commit()
    # Logica pentru a marca un task ca finalizat va fi aici
    return jsonify({"status": True, "data": task.as_dict()})

# TODO 7: Validare date la crearea unui task nou
# (de ex. câmpul title să fie obligatoriu) - implementare în cadrul funcției add_task()

# TODO 8: Adăugare filtrare pentru task-uri finalizate vs nefinalizate (GET cu parametru)
@app.route('/tasks/filter', methods=['GET'])
def filter_tasks():
    """Filtrare task-uri după status (completed sau nu)."""
    tasks = db.session.query(Task).filter(Task.completed == request.args.get["completed"]).all()
    tasks_dict = [task.as_dict() for task in tasks]
    # Logica pentru a filtra task-urile va fi aici
    return jsonify({"status": True, "data": tasks_dict})

# TODO 9: Adăugare suport pentru paginare la obținerea task-urilor (GET cu paginare)
@app.route('/tasks/paginate', methods=['GET'])
def paginate_tasks():
    """Paginare pentru obținerea task-urilor."""

    # Obține parametrii de paginare din request, cu valori implicite
    page = request.json['page']
    per_page = request.json['per_page']
    
    tasks = db.session.query(Task).limit(per_page).offset((page - 1) * per_page).all()
    
    return jsonify({"status": True, "data": [task.as_dict() for task in tasks]})


# TODO 10: Implementare căutare după titlul sau descrierea task-urilor (GET cu căutare)
@app.route('/tasks/search', methods=['GET'])
def search_tasks():
    if 'title' in request.json:
        req_title = request.json["title"]
        task = db.session.execute(select(Task.id, Task.title, Task.description, Task.completed).where(Task.title==req_title)).one()._asdict()
    elif 'description' in request.json:
        req_description = request.json["description"]
        task = db.session.execute(select(Task.id, Task.title, Task.description, Task.completed).where(Task.description==req_description)).one()._asdict()
    
    if not task:
         return jsonify({"status": False, "message": "No task found."}), 400
     
    return jsonify({"status": True, "data": task})

if __name__ == '__main__':
    app.run(debug=True)
