#!/bin/bash

# Script to generate PDF from French markdown file using pandoc with emoji support
# Usage: ./generate_pdf_with_emojis.sh

echo "🚀 Generating PDF from French Scoring System Guide (with emoji support)..."

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Error: pandoc is not installed."
    echo "Please install pandoc first:"
    echo "  macOS: brew install pandoc"
    echo "  Ubuntu: sudo apt-get install pandoc"
    echo "  Windows: Download from https://pandoc.org/installing.html"
    exit 1
fi

# Check if the original English markdown file exists
if [ ! -f "SCORING_SYSTEM_GUIDE.md" ]; then
    echo "❌ Error: SCORING_SYSTEM_GUIDE.md not found!"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p output

# Create a temporary file with emoji replacements for LaTeX compatibility
echo "🔄 Preparing markdown for PDF conversion..."

# Create a temporary file with emoji-to-text replacements
sed 's/🎯/[TARGET]/g; s/🏆/[TROPHY]/g; s/⭐/[STAR]/g; s/🚀/[ROCKET]/g' "SCORING_SYSTEM_GUIDE.md" > temp_guide_fr.md

# Generate PDF with enhanced formatting
echo "📄 Converting markdown to PDF..."

pandoc "temp_guide_fr.md" \
    -o "output/Guide_Systeme_Notation_JobGate_avec_emojis.pdf" \
    --pdf-engine=pdflatex \
    --variable fontsize=11pt \
    --variable geometry:margin=2.5cm \
    --variable colorlinks=true \
    --variable linkcolor=blue \
    --variable urlcolor=blue \
    --toc \
    --toc-depth=3 \
    --number-sections \
    --variable papersize=a4 \
    --variable documentclass=article \
    --standalone \
    --metadata title="Guide du Système de Notation JobGate" \
    --metadata author="JobGate Platform" \
    --metadata date="$(date '+%B %Y')"

# Clean up temporary file
rm -f temp_guide_fr.md

# Check if PDF was generated successfully
if [ -f "output/Guide_Systeme_Notation_JobGate_avec_emojis.pdf" ]; then
    echo "✅ PDF generated successfully!"
    echo "📁 Output file: output/Guide_Systeme_Notation_JobGate_avec_emojis.pdf"
    
    # Get file size
    file_size=$(du -h "output/Guide_Systeme_Notation_JobGate_avec_emojis.pdf" | cut -f1)
    echo "📊 File size: $file_size"
    
    # Try to open the PDF (macOS)
    if command -v open &> /dev/null; then
        echo "🔍 Opening PDF..."
        open "output/Guide_Systeme_Notation_JobGate_avec_emojis.pdf"
    fi
    
else
    echo "❌ Error: PDF generation failed!"
    exit 1
fi

echo "🎉 Done!"

# Also create an HTML version for better emoji support
echo "🌐 Creating HTML version with full emoji support..."

pandoc "GUIDE_SYSTEME_NOTATION_FR.md" \
    -o "output/Guide_Systeme_Notation_JobGate.html" \
    --standalone \
    --css=<(echo "
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem; 
            line-height: 1.6; 
        }
        h1, h2, h3 { color: #2563eb; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        blockquote { border-left: 4px solid #2563eb; padding-left: 1rem; margin-left: 0; }
    ") \
    --metadata title="Guide du Système de Notation JobGate" \
    --toc \
    --toc-depth=3

if [ -f "output/Guide_Systeme_Notation_JobGate.html" ]; then
    echo "✅ HTML version created successfully!"
    echo "📁 HTML file: output/Guide_Systeme_Notation_JobGate.html"
fi
