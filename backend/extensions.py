"""
Flask extensions initialization.
Separates extension instances from app factory to avoid circular imports.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
cors = CORS()
jwt = JWTManager()
