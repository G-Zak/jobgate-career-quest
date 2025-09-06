#!/bin/bash
# 🚀 Universal Pandoc PDF Converter Script
# A portable, robust script for converting Markdown to PDF using Pandoc
# Compatible with macOS, Linux, and Windows (WSL)
#
# Author: Zakaria Guennani
# Version: 2.0
# License: MIT

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ============================================================================
# CONFIGURATION & STYLING
# ============================================================================

# Colors for terminal output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly BLUE='\033[0;34m'
readonly YELLOW='\033[1;33m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly BOLD='\033[1m'
readonly NC='\033[0m' # No Color

# Default settings
readonly SCRIPT_NAME="Universal Pandoc Converter"
readonly VERSION="2.0"
readonly DEFAULT_OUTPUT_DIR="./exports/pdf"
readonly DEFAULT_FONT_SIZE="11pt"
readonly DEFAULT_MARGIN="1in"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

# Print colored output
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_header() { echo -e "${BOLD}${PURPLE}$1${NC}"; }

# Show script header
show_header() {
    clear
    print_header "
╔══════════════════════════════════════════════════════════════╗
║                    $SCRIPT_NAME v$VERSION                    ║
║              Professional Markdown to PDF Converter          ║
╚══════════════════════════════════════════════════════════════╝
"
}

# Show usage information
show_usage() {
    echo "
${BOLD}USAGE:${NC}
    $0 [OPTIONS] [INPUT_FILE] [OUTPUT_DIR]

${BOLD}OPTIONS:${NC}
    -h, --help              Show this help message
    -v, --version          Show version information
    -i, --interactive      Interactive mode (default if no args)
    -b, --batch           Batch convert all .md files in directory
    -f, --font-size SIZE  Font size (default: $DEFAULT_FONT_SIZE)
    -m, --margin SIZE     Page margins (default: $DEFAULT_MARGIN)
    -t, --template STYLE  Template style (minimal, academic, business, report)
    -o, --output DIR      Output directory (default: $DEFAULT_OUTPUT_DIR)

${BOLD}EXAMPLES:${NC}
    $0 README.md                           # Interactive output selection
    $0 -t business report.md ./output/     # Business template
    $0 -b ./docs/                          # Batch convert all .md in docs/
    $0 -f 12pt -m 0.8in analysis.md       # Custom formatting
    $0 --template academic thesis.md ~/Documents/

${BOLD}SUPPORTED TEMPLATES:${NC}
    minimal    - Clean, minimal design
    academic   - Academic papers with references
    business   - Professional business documents
    report     - Technical reports with TOC
"
}

# ============================================================================
# SYSTEM DETECTION & REQUIREMENTS
# ============================================================================

# Detect operating system
detect_os() {
    case "$(uname -s)" in
        Darwin)     echo "macOS" ;;
        Linux)      echo "Linux" ;;
        CYGWIN*|MINGW32*|MINGW64*|MSYS*) echo "Windows" ;;
        *)          echo "Unknown" ;;
    esac
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Find LaTeX engine
find_latex_engine() {
    local engines=(
        "pdflatex"                        # More compatible, try first
        "/usr/bin/pdflatex"               # Linux TeXLive pdflatex
        "/Library/TeX/texbin/pdflatex"    # macOS MacTeX pdflatex
        "/Library/TeX/texbin/xelatex"     # macOS MacTeX xelatex
        "/usr/bin/xelatex"                # Linux TeXLive xelatex
        "xelatex"                         # PATH
        "/opt/texlive/bin/xelatex"        # Custom install
    )
    
    for engine in "${engines[@]}"; do
        if command_exists "$engine"; then
            echo "$engine"
            return 0
        fi
    done
    
    return 1
}

# Check system requirements
check_requirements() {
    local missing_deps=()
    
    print_info "Checking system requirements..."
    
    # Check Pandoc
    if ! command_exists pandoc; then
        missing_deps+=("pandoc")
    else
        local pandoc_version=$(pandoc --version | head -n1 | awk '{print $2}')
        print_success "Pandoc found: v$pandoc_version"
    fi
    
    # Check LaTeX
    local latex_engine
    if latex_engine=$(find_latex_engine); then
        print_success "LaTeX engine found: $latex_engine"
    else
        missing_deps+=("LaTeX (xelatex or pdflatex)")
    fi
    
    # Report missing dependencies
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "Missing required dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        show_installation_guide
        exit 1
    fi
    
    print_success "All requirements satisfied!"
    echo ""
}

# Show installation guide
show_installation_guide() {
    local os=$(detect_os)
    
    echo -e "${YELLOW}Installation Guide for $os:${NC}"
    echo ""
    
    case $os in
        "macOS")
            echo "# Install Homebrew (if not installed)"
            echo "/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            echo ""
            echo "# Install Pandoc"
            echo "brew install pandoc"
            echo ""
            echo "# Install MacTeX (LaTeX)"
            echo "brew install --cask mactex"
            echo "# OR download from: http://www.tug.org/mactex/"
            ;;
        "Linux")
            echo "# Ubuntu/Debian:"
            echo "sudo apt update"
            echo "sudo apt install pandoc texlive-xetex texlive-fonts-recommended"
            echo ""
            echo "# CentOS/RHEL/Fedora:"
            echo "sudo dnf install pandoc texlive-xetex texlive-collection-fontsrecommended"
            ;;
        "Windows")
            echo "# Install using Chocolatey:"
            echo "choco install pandoc miktex"
            echo ""
            echo "# OR download manually:"
            echo "Pandoc: https://pandoc.org/installing.html"
            echo "MiKTeX: https://miktex.org/download"
            ;;
    esac
    echo ""
}

# ============================================================================
# TEMPLATE CONFIGURATIONS
# ============================================================================

# Get template configuration
get_template_config() {
    local template="$1"
    local font_size="$2"
    
    case "$template" in
        "minimal")
            echo "-V documentclass=article -V fontsize=$font_size"
            ;;
        "academic")
            echo "-V documentclass=article -V fontsize=$font_size -V linestretch=1.5 --toc --number-sections"
            ;;
        "business")
            echo "-V documentclass=article -V fontsize=$font_size -V linestretch=1.15 --toc"
            ;;
        "report")
            echo "-V documentclass=report -V fontsize=$font_size -V linestretch=1.2 --toc --number-sections"
            ;;
        *)
            echo "-V documentclass=article -V fontsize=$font_size"
            ;;
    esac
}

# ============================================================================
# CONVERSION FUNCTIONS
# ============================================================================

# Convert single markdown file to PDF
convert_file() {
    local input_file="$1"
    local output_dir="$2"
    local template="${3:-minimal}"
    local font_size="${4:-$DEFAULT_FONT_SIZE}"
    local margin="${5:-$DEFAULT_MARGIN}"
    
    # Validate input file
    if [[ ! -f "$input_file" ]]; then
        print_error "Input file not found: $input_file"
        return 1
    fi
    
    if [[ ! "$input_file" =~ \.md$ ]]; then
        print_error "Input file must be a Markdown file (.md): $input_file"
        return 1
    fi
    
    # Prepare output
    local filename=$(basename "$input_file" .md)
    local output_file="${output_dir}/${filename}.pdf"
    local safe_title=$(echo "$filename" | sed 's/_/ /g' | sed 's/-/ /g')
    
    # Create output directory
    mkdir -p "$output_dir"
    
    # Get template configuration
    local template_config=$(get_template_config "$template" "$font_size")
    
    # Get LaTeX engine
    local latex_engine=$(find_latex_engine)
    
    print_info "Converting: $(basename "$input_file")"
    print_info "Template: $template"
    print_info "Output: $output_file"
    
    # Try different conversion strategies
    local pandoc_cmd=""
    local conversion_success=false
    
    # Strategy 1: Try with pdflatex and basic settings
    if [[ "$latex_engine" == *"pdflatex"* ]]; then
        pandoc_cmd="pandoc \"$input_file\" \
            --pdf-engine=\"$latex_engine\" \
            $template_config \
            -V geometry:margin=\"$margin\" \
            -V title=\"$safe_title\" \
            -V date=\"$(date +'%B %d, %Y')\" \
            --output=\"$output_file\""
        
        if eval "$pandoc_cmd"; then
            conversion_success=true
        fi
    fi
    
    # Strategy 2: Try with xelatex if pdflatex failed or not available
    if [[ "$conversion_success" == false ]]; then
        local xelatex_engine=$(command -v xelatex || echo "/Library/TeX/texbin/xelatex")
        if command_exists "$xelatex_engine"; then
            pandoc_cmd="pandoc \"$input_file\" \
                --pdf-engine=\"$xelatex_engine\" \
                $template_config \
                -V geometry:margin=\"$margin\" \
                -V title=\"$safe_title\" \
                -V date=\"$(date +'%B %d, %Y')\" \
                -V mainfont=\"Times New Roman\" \
                -V sansfont=\"Arial\" \
                -V monofont=\"Courier New\" \
                --output=\"$output_file\""
            
            if eval "$pandoc_cmd"; then
                conversion_success=true
            fi
        fi
    fi
    
    # Check if conversion was successful
    if [[ "$conversion_success" == true ]] && [[ -f "$output_file" ]]; then
        local file_size=$(du -h "$output_file" | cut -f1)
        print_success "Conversion completed! ($file_size)"
        print_info "Saved to: $output_file"
        return 0
    else
        print_error "Conversion failed for: $input_file"
        print_error "Last command attempted: $pandoc_cmd"
        return 1
    fi
}

# Batch convert all markdown files in directory
batch_convert() {
    local source_dir="$1"
    local output_dir="$2"
    local template="${3:-minimal}"
    local font_size="${4:-$DEFAULT_FONT_SIZE}"
    local margin="${5:-$DEFAULT_MARGIN}"
    
    if [[ ! -d "$source_dir" ]]; then
        print_error "Source directory not found: $source_dir"
        return 1
    fi
    
    local md_files=($(find "$source_dir" -name "*.md" -type f))
    
    if [[ ${#md_files[@]} -eq 0 ]]; then
        print_warning "No Markdown files found in: $source_dir"
        return 1
    fi
    
    print_info "Found ${#md_files[@]} Markdown files"
    echo ""
    
    local success_count=0
    local total_count=${#md_files[@]}
    
    for md_file in "${md_files[@]}"; do
        if convert_file "$md_file" "$output_dir" "$template" "$font_size" "$margin"; then
            ((success_count++))
        fi
        echo ""
    done
    
    print_success "Batch conversion completed: $success_count/$total_count files converted"
}

# ============================================================================
# INTERACTIVE MODE
# ============================================================================

# Interactive file selection
select_input_file() {
    echo -e "${BOLD}Enter the path to your Markdown file:${NC}"
    read -p "File path: " input_file
    echo "$input_file"
}

# Interactive template selection
select_template() {
    echo -e "${BOLD}Select template style:${NC}"
    echo "  1. Minimal (default)"
    echo "  2. Academic (with TOC, numbered sections)"
    echo "  3. Business (professional layout)"
    echo "  4. Report (chapter-based)"
    echo ""
    
    while true; do
        read -p "Choose template (1-4) [1]: " choice
        choice=${choice:-1}
        
        case "$choice" in
            1) echo "minimal"; return ;;
            2) echo "academic"; return ;;
            3) echo "business"; return ;;
            4) echo "report"; return ;;
            *) print_error "Invalid choice. Please try again." ;;
        esac
    done
}

# Interactive mode
interactive_mode() {
    print_header "Interactive Mode"
    echo ""
    
    # Select input file
    echo -e "${BOLD}Select Markdown file from docs directory:${NC}"
    echo ""
    
    # Find all markdown files in docs directory only
    local docs_files=($(find ./docs -name "*.md" -type f 2>/dev/null))
    
    local file_count=0
    
    # Add docs files
    if [[ ${#docs_files[@]} -gt 0 ]]; then
        echo -e "${CYAN}Available files in docs/:${NC}"
        for file in "${docs_files[@]}"; do
            ((file_count++))
            echo "  $file_count. $file"
        done
        echo ""
    else
        print_warning "No Markdown files found in ./docs directory"
        echo "  1. Enter custom path"
        echo ""
        file_count=0
    fi
    
    echo "  $((file_count+1)). Enter custom path"
    echo ""
    
    # File selection
    local input_file=""
    while true; do
        read -p "Choose file (1-$((file_count+1))): " choice
        
        if [[ "$choice" =~ ^[0-9]+$ ]] && [[ "$choice" -ge 1 ]] && [[ "$choice" -le $file_count ]] && [[ $file_count -gt 0 ]]; then
            input_file="${docs_files[$((choice-1))]}"
            break
        elif [[ "$choice" -eq $((file_count+1)) ]]; then
            read -p "Enter path to Markdown file: " input_file
            break
        else
            print_error "Invalid choice. Please try again."
        fi
    done
    echo ""
    
    # Select template
    echo -e "${BOLD}Select template style:${NC}"
    echo "  1. Minimal (default)"
    echo "  2. Academic (with TOC, numbered sections)"
    echo "  3. Business (professional layout)"
    echo "  4. Report (chapter-based)"
    echo ""
    
    local template=""
    while true; do
        read -p "Choose template (1-4) [1]: " choice
        choice=${choice:-1}
        
        case "$choice" in
            1) template="minimal"; break ;;
            2) template="academic"; break ;;
            3) template="business"; break ;;
            4) template="report"; break ;;
            *) print_error "Invalid choice. Please try again." ;;
        esac
    done
    echo ""
    
    # Select output directory with preset options
    echo -e "${BOLD}Select output directory:${NC}"
    echo "  1. Default (./exports/pdf)"
    echo "  2. Downloads folder"
    echo "  3. Custom path"
    echo ""
    
    local output_dir=""
    while true; do
        read -p "Choose output location (1-3) [1]: " choice
        choice=${choice:-1}
        
        case "$choice" in
            1) output_dir="$DEFAULT_OUTPUT_DIR"; break ;;
            2) output_dir="$HOME/Downloads"; break ;;
            3) read -p "Enter custom output directory: " output_dir; break ;;
            *) print_error "Invalid choice. Please try again." ;;
        esac
    done
    
    echo ""
    print_info "Configuration:"
    echo "  Input: $input_file"
    echo "  Template: $template"
    echo "  Output: $output_dir"
    echo ""
    
    read -p "Proceed with conversion? (y/N): " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        echo ""
        convert_file "$input_file" "$output_dir" "$template" "$DEFAULT_FONT_SIZE" "$DEFAULT_MARGIN"
    else
        print_info "Conversion cancelled."
    fi
}

# ============================================================================
# MAIN SCRIPT LOGIC
# ============================================================================

# Parse command line arguments
parse_arguments() {
    local mode="interactive"
    local input_file=""
    local output_dir="$DEFAULT_OUTPUT_DIR"
    local template="minimal"
    local font_size="$DEFAULT_FONT_SIZE"
    local margin="$DEFAULT_MARGIN"
    local batch_dir=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -v|--version)
                echo "$SCRIPT_NAME v$VERSION"
                exit 0
                ;;
            -i|--interactive)
                mode="interactive"
                shift
                ;;
            -b|--batch)
                mode="batch"
                batch_dir="$2"
                shift 2
                ;;
            -f|--font-size)
                font_size="$2"
                shift 2
                ;;
            -m|--margin)
                margin="$2"
                shift 2
                ;;
            -t|--template)
                template="$2"
                shift 2
                ;;
            -o|--output)
                output_dir="$2"
                shift 2
                ;;
            -*)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
            *)
                if [[ -z "$input_file" ]]; then
                    input_file="$1"
                    mode="direct"
                elif [[ -z "$batch_dir" && "$mode" == "batch" ]]; then
                    batch_dir="$1"
                else
                    output_dir="$1"
                fi
                shift
                ;;
        esac
    done
    
    # Execute based on mode
    case "$mode" in
        "interactive")
            interactive_mode
            ;;
        "batch")
            if [[ -z "$batch_dir" ]]; then
                batch_dir="."
            fi
            batch_convert "$batch_dir" "$output_dir" "$template" "$font_size" "$margin"
            ;;
        "direct")
            convert_file "$input_file" "$output_dir" "$template" "$font_size" "$margin"
            ;;
    esac
}

# ============================================================================
# SCRIPT ENTRY POINT
# ============================================================================

main() {
    show_header
    check_requirements
    
    if [[ $# -eq 0 ]]; then
        interactive_mode
    else
        parse_arguments "$@"
    fi
    
    echo ""
    print_success "Script completed!"
}

# Run main function with all arguments
main "$@"
