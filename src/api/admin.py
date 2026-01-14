  
import os
from flask import redirect, url_for, request
from flask_admin import Admin, AdminIndexView, expose
from .models import db, User, Locales, Direccion, Reservation
from flask_admin.contrib.sqla import ModelView
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps

class SecureModelView(ModelView):
    def is_accessible(self):
        # Only allow access if user is authenticated via JWT
        try:
            verify_jwt_in_request()
            return True
        except:
            return False
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('api.login_required_message'))

class SecureAdminIndexView(AdminIndexView):
    @expose('/')
    def index(self):
        try:
            verify_jwt_in_request()
            return super(SecureAdminIndexView, self).index()
        except:
            return redirect(url_for('api.login_required_message'))

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Ruta3B Admin', index_view=SecureAdminIndexView())

    # Add your models here with secure views
    admin.add_view(SecureModelView(User, db.session))
    admin.add_view(SecureModelView(Locales, db.session))
    admin.add_view(SecureModelView(Direccion, db.session))
    admin.add_view(SecureModelView(Reservation, db.session))