from app import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    sgr_points = db.Column(db.Integer, nullable=False, default=0)
    favourite_sgr_point_id = db.Column(db.Integer, db.ForeignKey('sgr_point.id'), nullable=True)
    favourite_sgr_point = db.relationship('SGR_point', backref='favourite_users', lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"
