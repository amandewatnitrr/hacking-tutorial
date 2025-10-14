"""
Safe example module to demonstrate parameterized queries.
This file executes only safe, parameterized SQL queries on a small local DB.
"""

from flask import Blueprint, request, jsonify, current_app
from .db_setup import init_db

bp = Blueprint("safe", __name__, url_prefix="/safe")

_conn = init_db()

@bp.route("/search", methods=["GET"])
def search_user():
    """
    Query example: /safe/search?q=alice
    Uses parameterized queries to avoid SQL injection.
    """
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"error": "Missing query parameter 'q'.", "advice": "Provide a username to search."}), 400

    cur = _conn.cursor()
    # Parameterized query (safe). Do NOT build SQL by concatenating user input.
    cur.execute("SELECT id, username, full_name FROM users WHERE username = ? LIMIT 10;", (q,))
    rows = cur.fetchall()
    results = [{"id": r[0], "username": r[1], "full_name": r[2]} for r in rows]
    return jsonify({
        "query": q,
        "count": len(results),
        "results": results,
        "advice": "This endpoint demonstrates safe parameterized queries. Always validate and parameterize inputs."
    })
