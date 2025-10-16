"""
Run the combined lab app. Exposes:
- /vulnerable/    -> illustrative vulnerable pattern (non-executable)
- /safe/search?q= -> safe parameterized search
- /exercises/     -> static markdown files served as text for convenience
"""

from flask import Flask, send_from_directory, jsonify
from .vulnerable_app import bp as vulnerable_bp
from .safe_app import bp as safe_bp
import os

def create_app():
    app = Flask(__name__, static_folder=None)
    app.register_blueprint(vulnerable_bp)
    app.register_blueprint(safe_bp)

    @app.route("/")
    def index():
        return jsonify({
            "lab": "SQL Injection Learning Lab (safe)",
            "endpoints": {
                "vulnerable_info": "/vulnerable/",
                "safe_search": "/safe/search?q=<username>",
                "exercises": "/exercises/"
            },
            "note": "This is a learning sandbox. Do not perform attacks on third-party systems."
        })

    @app.route("/exercises/<path:fname>")
    def exercise_files(fname):
        base = os.path.join(os.path.dirname(__file__), "..", "exercises")
        # send file content as plain text
        return send_from_directory(base, fname)

    return app

if __name__ == "__main__":
    app = create_app()
    # For simple runs (local or in Docker)
    app.run(host="0.0.0.0", port=8000, debug=False)
