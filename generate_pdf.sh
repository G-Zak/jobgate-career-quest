#!/bin/bash

# Script to generate PDF from French markdown file using pandoc
# Usage: ./generate_pdf.sh

echo "🚀 Generating PDF from French Scoring System Guide..."

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Error: pandoc is not installed."
    echo "Please install pandoc first:"
    echo "  macOS: brew install pandoc"
    echo "  Ubuntu: sudo apt-get install pandoc"
    echo "  Windows: Download from https://pandoc.org/installing.html"
    exit 1
fi

# Check if the French markdown file exists
if [ ! -f "GUIDE_SYSTEME_NOTATION_FR.md" ]; then
    echo "❌ Error: GUIDE_SYSTEME_NOTATION_FR.md not found!"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p output

# Generate PDF with enhanced formatting
echo "📄 Converting markdown to PDF..."

pandoc "GUIDE_SYSTEME_NOTATION_FR.md" \
    -o "output/Guide_Systeme_Notation_JobGate.pdf" \
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
    --standalone

# Check if PDF was generated successfully
if [ -f "output/Guide_Systeme_Notation_JobGate.pdf" ]; then
    echo "✅ PDF generated successfully!"
    echo "📁 Output file: output/Guide_Systeme_Notation_JobGate.pdf"
    
    # Get file size
    file_size=$(du -h "output/Guide_Systeme_Notation_JobGate.pdf" | cut -f1)
    echo "📊 File size: $file_size"
    
    # Try to open the PDF (macOS)
    if command -v open &> /dev/null; then
        echo "🔍 Opening PDF..."
        open "output/Guide_Systeme_Notation_JobGate.pdf"
    fi
    
else
    echo "❌ Error: PDF generation failed!"
    exit 1
fi

echo "🎉 Done!"
