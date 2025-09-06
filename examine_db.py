import sqlite3
import json
from pprint import pprint

# Connect to the SQLite database
conn = sqlite3.connect('Abstract_Reasoning.db')
cursor = conn.cursor()

# Get list of tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Tables in the database:")
for table in tables:
    print(f"- {table[0]}")
    
    # Get table schema
    cursor.execute(f"PRAGMA table_info({table[0]})")
    columns = cursor.fetchall()
    print(f"\nSchema for {table[0]}:")
    for col in columns:
        print(f"  {col[1]} ({col[2]})")
    
    # Get sample data (first 3 rows)
    cursor.execute(f"SELECT * FROM {table[0]} LIMIT 3")
    rows = cursor.fetchall()
    print(f"\nSample data from {table[0]} (first 3 rows):")
    for row in rows:
        print(f"  {row}")
    
    print("\n" + "-"*50 + "\n")

conn.close()
