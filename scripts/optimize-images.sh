#!/bin/bash

# Image Optimization Script for DigitalMeld.ai
# Generates responsive image sizes and WebP versions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGES_DIR="assets/images"
BREAKPOINTS=(320 640 768 1024 1280 1536)
QUALITY=85
WEBP_QUALITY=80

echo -e "${GREEN}🖼️  Starting image optimization...${NC}"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick is not installed. Please install it first:${NC}"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

# Check if cwebp is installed for WebP conversion
if ! command -v cwebp &> /dev/null; then
    echo -e "${YELLOW}⚠️  cwebp is not installed. WebP conversion will be skipped.${NC}"
    echo "  macOS: brew install webp"
    echo "  Ubuntu: sudo apt-get install webp"
    WEBP_AVAILABLE=false
else
    WEBP_AVAILABLE=true
fi

# Function to optimize a single image
optimize_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local name="${filename%.*}"
    local extension="${filename##*.}"
    
    echo -e "${YELLOW}📸 Processing: $filename${NC}"
    
    # Skip SVG files
    if [[ "$extension" == "svg" ]]; then
        echo "  ⏭️  Skipping SVG file"
        return
    fi
    
    # Skip favicon files
    if [[ "$filename" == "favicon"* ]]; then
        echo "  ⏭️  Skipping favicon file"
        return
    fi
    
    # Get original dimensions
    local original_width=$(identify -format "%w" "$input_file")
    local original_height=$(identify -format "%h" "$input_file")
    
    echo "  📏 Original size: ${original_width}x${original_height}"
    
    # Generate responsive sizes
    for width in "${BREAKPOINTS[@]}"; do
        # Skip if breakpoint is larger than original
        if [ "$width" -gt "$original_width" ]; then
            continue
        fi
        
        local output_file="${IMAGES_DIR}/${name}-${width}w.${extension}"
        
        # Generate JPEG/PNG version
        convert "$input_file" \
            -resize "${width}x" \
            -quality "$QUALITY" \
            -strip \
            -interlace Plane \
            "$output_file"
        
        echo "  ✅ Generated: ${name}-${width}w.${extension}"
        
        # Generate WebP version if available
        if [ "$WEBP_AVAILABLE" = true ]; then
            local webp_output="${IMAGES_DIR}/${name}-${width}w.webp"
            cwebp -q "$WEBP_QUALITY" "$output_file" -o "$webp_output" > /dev/null 2>&1
            echo "  ✅ Generated: ${name}-${width}w.webp"
        fi
    done
    
    # Optimize original file
    local optimized_original="${IMAGES_DIR}/${name}-optimized.${extension}"
    convert "$input_file" \
        -quality "$QUALITY" \
        -strip \
        -interlace Plane \
        "$optimized_original"
    
    # Replace original with optimized version
    mv "$optimized_original" "$input_file"
    echo "  ✅ Optimized original file"
    
    # Generate WebP version of original if available
    if [ "$WEBP_AVAILABLE" = true ]; then
        local webp_original="${IMAGES_DIR}/${name}.webp"
        cwebp -q "$WEBP_QUALITY" "$input_file" -o "$webp_original" > /dev/null 2>&1
        echo "  ✅ Generated: ${name}.webp"
    fi
}

# Function to generate favicon sizes
generate_favicons() {
    local favicon_svg="${IMAGES_DIR}/favicon.svg"
    
    if [ ! -f "$favicon_svg" ]; then
        echo -e "${YELLOW}⚠️  favicon.svg not found, skipping favicon generation${NC}"
        return
    fi
    
    echo -e "${YELLOW}🎯 Generating favicon sizes...${NC}"
    
    # Generate different favicon sizes
    local sizes=(16 32 48 64 128 192 256 512)
    
    for size in "${sizes[@]}"; do
        local output_file="${IMAGES_DIR}/favicon-${size}x${size}.png"
        convert "$favicon_svg" -resize "${size}x${size}" "$output_file"
        echo "  ✅ Generated: favicon-${size}x${size}.png"
    done
    
    # Generate Apple Touch Icon
    convert "$favicon_svg" -resize "180x180" "${IMAGES_DIR}/apple-touch-icon.png"
    echo "  ✅ Generated: apple-touch-icon.png"
    
    # Generate ICO file with multiple sizes
    convert "$favicon_svg" \
        \( -clone 0 -resize 16x16 \) \
        \( -clone 0 -resize 32x32 \) \
        \( -clone 0 -resize 48x48 \) \
        -delete 0 "${IMAGES_DIR}/favicon.ico"
    echo "  ✅ Generated: favicon.ico"
}

# Function to create placeholder images
create_placeholders() {
    echo -e "${YELLOW}🎨 Creating placeholder images...${NC}"
    
    # Create a generic placeholder for missing images
    convert -size 800x600 xc:'#f3f4f6' \
        -gravity center \
        -pointsize 24 \
        -fill '#9ca3af' \
        -annotate +0+0 'Image Loading...' \
        "${IMAGES_DIR}/placeholder.jpg"
    echo "  ✅ Generated: placeholder.jpg"
    
    # Create Open Graph image if it doesn't exist
    if [ ! -f "${IMAGES_DIR}/og-image.png" ]; then
        convert -size 1200x630 xc:'#1f2937' \
            -gravity center \
            -pointsize 48 \
            -fill '#ffffff' \
            -annotate +0-50 'DigitalMeld.ai' \
            -pointsize 24 \
            -fill '#8b5cf6' \
            -annotate +0+50 'AI-Powered Operational Intelligence' \
            "${IMAGES_DIR}/og-image.png"
        echo "  ✅ Generated: og-image.png"
    fi
}

# Main execution
main() {
    # Create images directory if it doesn't exist
    mkdir -p "$IMAGES_DIR"
    
    # Generate favicons
    generate_favicons
    
    # Create placeholder images
    create_placeholders
    
    # Process all JPEG and PNG files
    for file in "${IMAGES_DIR}"/*.{jpg,jpeg,png}; do
        # Skip if no files match the pattern
        [ -e "$file" ] || continue
        
        # Skip already processed files
        if [[ "$file" =~ -[0-9]+w\. ]] || [[ "$file" =~ favicon- ]] || [[ "$file" =~ apple-touch ]] || [[ "$file" =~ og-image ]] || [[ "$file" =~ placeholder ]]; then
            continue
        fi
        
        optimize_image "$file"
    done
    
    echo -e "${GREEN}✅ Image optimization complete!${NC}"
    echo ""
    echo -e "${YELLOW}📊 Summary:${NC}"
    echo "  - Generated responsive images for breakpoints: ${BREAKPOINTS[*]}"
    echo "  - JPEG/PNG quality: $QUALITY%"
    if [ "$WEBP_AVAILABLE" = true ]; then
        echo "  - WebP quality: $WEBP_QUALITY%"
        echo "  - WebP versions created for better performance"
    fi
    echo "  - Favicons generated in multiple sizes"
    echo "  - Placeholder images created"
    echo ""
    echo -e "${GREEN}🚀 Your images are now optimized for performance!${NC}"
}

# Run the main function
main "$@"