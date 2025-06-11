import sqlite3
from flask import g

DATABASE = "api/db/inventory.db"  # Adjust the path if your DB file lives elsewhere

def initialize_db():
    conn = sqlite3.connect(DATABASE)
    with open("api/db/schema.sql", "r") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

if __name__ == "__main__":
    initialize_db()
    print("Database initialized successfully")