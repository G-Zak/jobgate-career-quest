"""
Combined migration script that converts both abstract reasoning and numerical reasoning
questions from JSON to SQLite databases
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Run both migration scripts"""
    print("Starting skills tests migration to SQLite databases...")
    
    # Get the current directory
    current_dir = Path(__file__).resolve().parent
    
    # Define paths to migration scripts
    abstract_script = current_dir / 'migrate_abstract_questions.py'
    numerical_script = current_dir / 'migrate_numerical_questions.py'
    
    # Check if scripts exist
    if not abstract_script.exists():
        print(f"Error: Abstract reasoning migration script not found at {abstract_script}")
        return 1
        
    if not numerical_script.exists():
        print(f"Error: Numerical reasoning migration script not found at {numerical_script}")
        return 1
    
    # Run abstract reasoning migration
    print("\n=== Migrating Abstract Reasoning Questions ===")
    abstract_result = subprocess.run([sys.executable, str(abstract_script)], capture_output=True, text=True)
    
    if abstract_result.returncode != 0:
        print(f"Error running abstract reasoning migration: {abstract_result.stderr}")
    else:
        print(abstract_result.stdout)
    
    # Run numerical reasoning migration
    print("\n=== Migrating Numerical Reasoning Questions ===")
    numerical_result = subprocess.run([sys.executable, str(numerical_script)], capture_output=True, text=True)
    
    if numerical_result.returncode != 0:
        print(f"Error running numerical reasoning migration: {numerical_result.stderr}")
    else:
        print(numerical_result.stdout)
    
    # Convert SVG files to PNG
    print("\n=== Converting SVG files to PNG ===")
    svg_converter = current_dir / 'backend' / 'skills_tests' / 'svg_to_png.py'
    
    if svg_converter.exists():
        svg_result = subprocess.run([sys.executable, str(svg_converter)], capture_output=True, text=True)
        
        if svg_result.returncode != 0:
            print(f"Error converting SVG files: {svg_result.stderr}")
        else:
            print(svg_result.stdout)
    else:
        print(f"Warning: SVG converter script not found at {svg_converter}")
    
    print("\n=== Migration Complete ===")
    print("SQLite databases created:")
    print("- Abstract_Reasoning.db")
    print("- Numerical_Reasoning.db")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
