from flask import Blueprint, render_template, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from app import db, bcrypt
from app.models import User
from app.forms import RegistrationForm, LoginForm

auth = Blueprint('auth', __name__)

@auth.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('auth.dashboard'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You can now log in.', 'success')
        return redirect(url_for('auth.login'))
    return render_template('register.html', form=form)

@auth.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('auth.dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password.data, form.password.data):
            login_user(user, remember=form.remember.data)
            return redirect(url_for('auth.dashboard'))
        else:
            flash('Login unsuccessful. Check email and password.', 'danger')
    return render_template('login.html', form=form)

@auth.route("/dashboard")
@login_required
def dashboard():
    return render_template('dashboard.html', username=current_user.username)

@auth.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
