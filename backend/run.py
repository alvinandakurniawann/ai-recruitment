#!/usr/bin/env python
"""
Simple runner script for Flask application.
Run with: python run.py
"""

from app import create_app

if __name__ == '__main__':
    import os
    app = create_app()
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
