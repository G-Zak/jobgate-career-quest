#!/bin/bash

# Professional PDF Generation Script for Internship Showcase
# Generates a polished, LinkedIn-ready PDF document

echo "🚀 Generating Professional Internship Showcase PDF..."
echo ""

# Create output directory if it doesn't exist
mkdir -p output

# Input and output files
INPUT_FILE="INTERNSHIP_SHOWCASE.md"
OUTPUT_FILE="output/JobGate_Internship_Showcase_Zakaria_Guennani.pdf"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: Input file '$INPUT_FILE' not found!"
    exit 1
fi

echo "📄 Converting markdown to PDF..."
echo "   Input: $INPUT_FILE"
echo "   Output: $OUTPUT_FILE"
echo ""

# Generate PDF with professional styling
pandoc "$INPUT_FILE" \
    -o "$OUTPUT_FILE" \
    --pdf-engine=pdflatex \
    --variable fontsize=11pt \
    --variable geometry:margin=2cm \
    --variable geometry:top=2.5cm \
    --variable geometry:bottom=2.5cm \
    --variable colorlinks=true \
    --variable linkcolor=blue \
    --variable urlcolor=blue \
    --variable toccolor=black \
    --toc \
    --toc-depth=2 \
    --number-sections \
    --variable papersize=a4 \
    --variable documentclass=article \
    --standalone \
    --metadata title="JobGate Platform - Internship Project Overview" \
    --metadata author="Zakaria Guennani - Software Engineering Intern" \
    --metadata date="July - September 2025 | Dropgate" \
    --metadata subject="Software Engineering Internship Showcase" \
    --metadata keywords="Software Engineering, Full-Stack Development, AI/ML, Recruitment Technology, Django, React" \
    --highlight-style=tango \
    --variable mainfont="Helvetica" \
    --variable monofont="Courier" \
    2>&1

# Check if PDF was generated successfully
if [ $? -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
    echo "✅ PDF generated successfully!"
    echo ""
    echo "📁 Output file: $OUTPUT_FILE"
    
    # Get file size
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo "📊 File size: $FILE_SIZE"
    
    # Get page count (if pdfinfo is available)
    if command -v pdfinfo &> /dev/null; then
        PAGE_COUNT=$(pdfinfo "$OUTPUT_FILE" 2>/dev/null | grep "Pages:" | awk '{print $2}')
        if [ ! -z "$PAGE_COUNT" ]; then
            echo "📄 Page count: $PAGE_COUNT pages"
        fi
    fi
    
    echo ""
    echo "🎉 Done! Your professional internship showcase is ready to share on LinkedIn!"
    echo ""
    echo "💡 Suggested LinkedIn Post:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 Excited to share my Software Engineering Internship experience at Dropgate!"
    echo ""
    echo "Over the past 3 months (July-September 2025), I had the incredible opportunity"
    echo "to design and build JobGate - an AI-powered recruitment platform that transforms"
    echo "how companies assess and match candidates with job opportunities."
    echo ""
    echo "🔧 Key Technical Achievements:"
    echo "• Built full-stack platform using React, Django, and PostgreSQL"
    echo "• Implemented AI/ML recommendation engine with 78% match accuracy"
    echo "• Developed comprehensive skills assessment system with 8+ test types"
    echo "• Created employability scoring algorithm with profile-based weighting"
    echo "• Designed candidate clustering using machine learning (Scikit-learn)"
    echo ""
    echo "📊 Impact:"
    echo "• 40% improvement in candidate assessment accuracy"
    echo "• 80% reduction in manual evaluation time"
    echo "• 65% decrease in irrelevant job suggestions"
    echo ""
    echo "I've attached a detailed project overview showcasing the technical architecture,"
    echo "key features, and lessons learned. Check it out! 📎"
    echo ""
    echo "Grateful to the Dropgate team for this amazing learning experience! 🙏"
    echo ""
    echo "#SoftwareEngineering #FullStackDevelopment #AI #MachineLearning"
    echo "#RecruitmentTech #Django #React #Internship #TechCareers"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Open PDF (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "🔍 Opening PDF..."
        open "$OUTPUT_FILE"
    fi
    
else
    echo "❌ Error: PDF generation failed!"
    echo ""
    echo "Possible issues:"
    echo "  1. pandoc is not installed (install with: brew install pandoc)"
    echo "  2. pdflatex is not installed (install with: brew install basictex)"
    echo "  3. LaTeX packages are missing"
    echo ""
    echo "To install required tools on macOS:"
    echo "  brew install pandoc"
    echo "  brew install basictex"
    echo "  sudo tlmgr update --self"
    echo "  sudo tlmgr install collection-fontsrecommended"
    exit 1
fi

