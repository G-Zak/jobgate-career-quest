"""
SVG to PNG Conversion Utility for Abstract Reasoning Tests
Converts SVG files to PNG for use in the frontend
"""

import os
import json
import subprocess
from pathlib import Path

# Try to import from different libraries - only one is needed
try:
    from cairosvg import svg2png
    CONVERTER = 'cairosvg'
except ImportError:
    try:
        from wand.image import Image
        CONVERTER = 'wand'
    except ImportError:
        try:
            from svglib.svglib import svg2rlg
            from reportlab.graphics import renderPM
            CONVERTER = 'svglib'
        except ImportError:
            # If no library is available, we'll use Inkscape or a similar tool
            CONVERTER = 'external'

def convert_svg_to_png(svg_file, output_file, width=800, height=600):
    """
    Convert SVG file to PNG using available method
    
    Args:
        svg_file: Path to SVG file or SVG content string
        output_file: Path to save the PNG file
        width: Output width in pixels
        height: Output height in pixels
    """
    # Determine if svg_file is a path or content string
    is_content = svg_file.strip().startswith('<svg')
    
    if CONVERTER == 'cairosvg':
        if is_content:
            svg2png(bytestring=svg_file, write_to=output_file, output_width=width, output_height=height)
        else:
            with open(svg_file, 'r') as f:
                svg_content = f.read()
            svg2png(bytestring=svg_content, write_to=output_file, output_width=width, output_height=height)
    
    elif CONVERTER == 'wand':
        if is_content:
            with Image(blob=svg_file.encode('utf-8'), format='svg', width=width, height=height) as img:
                img.save(filename=output_file)
        else:
            with Image(filename=svg_file, width=width, height=height) as img:
                img.save(filename=output_file)
    
    elif CONVERTER == 'svglib':
        if is_content:
            from io import StringIO
            drawing = svg2rlg(StringIO(svg_file))
        else:
            drawing = svg2rlg(svg_file)
        renderPM.drawToFile(drawing, output_file, fmt='PNG')
    
    elif CONVERTER == 'external':
        # Try using external tool (Inkscape, etc.)
        if is_content:
            # Write to temporary file first
            temp_svg = output_file + '.temp.svg'
            with open(temp_svg, 'w') as f:
                f.write(svg_file)
            svg_file = temp_svg
        
        try:
            # Try Inkscape first
            subprocess.run([
                'inkscape',
                '--export-filename', output_file,
                '--export-width', str(width),
                '--export-height', str(height),
                svg_file
            ], check=True)
        except (subprocess.SubprocessError, FileNotFoundError):
            # Try imagemagick convert
            try:
                subprocess.run([
                    'convert',
                    '-background', 'none',
                    '-resize', f'{width}x{height}',
                    svg_file, output_file
                ], check=True)
            except (subprocess.SubprocessError, FileNotFoundError):
                raise RuntimeError("No SVG conversion tool available. Please install one of: cairosvg, wand, svglib, Inkscape, or ImageMagick")
        
        # Clean up temporary file if created
        if is_content and os.path.exists(temp_svg):
            os.unlink(temp_svg)

def convert_all_svgs_in_directory():
    """
    Convert all SVG files in the abstract_reasoning directory to PNG
    """
    # Get project root directory
    root_dir = Path(__file__).resolve().parent.parent.parent
    
    # Source directory with SVG files
    svg_dir = root_dir / 'frontend' / 'src' / 'assets' / 'images' / 'abstract_reasoning'
    
    # Make sure the output directory exists
    os.makedirs(svg_dir, exist_ok=True)
    
    # Process all SVG files
    for svg_file in svg_dir.glob('*.svg'):
        # Output PNG file path
        png_file = svg_file.with_suffix('.png')
        
        print(f"Converting {svg_file.name} to {png_file.name}...")
        
        try:
            convert_svg_to_png(str(svg_file), str(png_file))
        except Exception as e:
            print(f"Error converting {svg_file.name}: {e}")

if __name__ == "__main__":
    print(f"Using {CONVERTER} for SVG to PNG conversion")
    convert_all_svgs_in_directory()
    print("Conversion complete!")
