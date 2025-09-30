#!/bin/bash

# Script to generate PDFs in both English and French
# Usage: ./generate_all_pdfs.sh

echo "📚 Generating PDFs for JobGate Scoring System Guide..."

# Create output directory if it doesn't exist
mkdir -p output

# Function to generate PDF from markdown
generate_pdf() {
    local input_file="$1"
    local output_file="$2"
    local title="$3"
    
    echo "📄 Converting $input_file to PDF..."
    
    pandoc "$input_file" \
        -o "$output_file" \
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
        --metadata title="$title" \
        --metadata author="JobGate Platform" \
        --metadata date="$(date '+%B %Y')"
    
    if [ -f "$output_file" ]; then
        file_size=$(du -h "$output_file" | cut -f1)
        echo "✅ $output_file created successfully! (Size: $file_size)"
    else
        echo "❌ Failed to create $output_file"
        return 1
    fi
}

# Generate English PDF
if [ -f "SCORING_SYSTEM_GUIDE.md" ]; then
    generate_pdf "SCORING_SYSTEM_GUIDE.md" "output/JobGate_Scoring_System_Guide_EN.pdf" "JobGate Scoring System Guide"
else
    echo "⚠️  SCORING_SYSTEM_GUIDE.md not found, skipping English PDF"
fi

# Generate French PDF
if [ -f "GUIDE_SYSTEME_NOTATION_FR.md" ]; then
    generate_pdf "GUIDE_SYSTEME_NOTATION_FR.md" "output/Guide_Systeme_Notation_JobGate_FR.pdf" "Guide du Système de Notation JobGate"
else
    echo "⚠️  GUIDE_SYSTEME_NOTATION_FR.md not found, skipping French PDF"
fi

# List all generated files
echo ""
echo "📁 Generated files:"
ls -la output/*.pdf 2>/dev/null || echo "No PDF files found in output directory"

echo ""
echo "🎉 PDF generation complete!"

# Try to open the output directory (macOS)
if command -v open &> /dev/null; then
    echo "📂 Opening output directory..."
    open output/
fi
