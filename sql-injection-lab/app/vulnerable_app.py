"""
Illustrative 'vulnerable' module.

IMPORTANT: This endpoint does NOT execute unsafe SQL. Instead it demonstrates
the pattern that is commonly unsafe and explains why. No exploit payloads
are executed or provided here.
"""

from flask import Blueprint, request, jsonify

bp = Blueprint("vulnerable", __name__, url_prefix="/vulnerable")

@bp.route("/", methods=["GET"])
def vulnerable_info():
    q = request.args.get("q", "")
    # Show the *pattern* that is dangerous — as a string only (not executed)
    illustrative_pattern = "SELECT * FROM users WHERE username = '{}';".format("{user_input}")
    return jsonify({
        "title": "Illustrative Vulnerable Pattern",
        "note": (
            "This endpoint is intentionally non-executable. It returns an example "
            "of a string-based SQL construction pattern that is unsafe when "
            "user input is inserted directly. Do NOT use such patterns in real code."
        ),
        "illustrative_pattern": illustrative_pattern,
        "user_input_received": q,
        "advice": "Use parameterized queries and input validation. See /safe for a safe example."
    })
