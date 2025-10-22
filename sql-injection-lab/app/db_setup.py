import sqlite3
import os

# Determine a cross-platform writable path for the database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB_DIR = os.path.join(BASE_DIR, "database")

# Create the directory if it doesn't exist
os.makedirs(DEFAULT_DB_DIR, exist_ok=True)

# Allow overriding the path via environment variable
DB_PATH = os.environ.get("LAB_DB_PATH", os.path.join(DEFAULT_DB_DIR, "lab.db"))

def init_db():
    need_seed = not os.path.exists(DB_PATH)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)

    if need_seed:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                full_name TEXT
            );
        """)

        # Sample users for learning/demo purposes
        sample = [
            ("alice", "Alice Example"),
            ("bob", "Bob Example"),
            ("charlie", "Charlie Example")
        ]
        cursor.executemany(
            "INSERT INTO users (username, full_name) VALUES (?, ?);",
            sample
        )
        conn.commit()

    return conn
