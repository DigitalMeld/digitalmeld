#!/bin/bash

# DigitalMeld.ai Deployment Verification Script
# This script verifies that the GitHub Pages deployment is working correctly

echo "🚀 DigitalMeld.ai Deployment Verification"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domain to test
DOMAIN="digitalmeld.ai"
HTTPS_URL="https://$DOMAIN"

echo -e "\n📡 Testing DNS resolution..."
if dig +short $DOMAIN | grep -q "185.199.1"; then
    echo -e "${GREEN}✅ DNS correctly points to GitHub Pages${NC}"
else
    echo -e "${RED}❌ DNS not pointing to GitHub Pages${NC}"
    echo "Expected GitHub Pages IPs: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153"
    echo "Current DNS resolution:"
    dig +short $DOMAIN
fi

echo -e "\n🔒 Testing HTTPS and SSL certificate..."
if curl -s -I $HTTPS_URL | grep -q "HTTP/2 200"; then
    echo -e "${GREEN}✅ HTTPS is working${NC}"
    
    # Check SSL certificate
    echo -e "\n📜 SSL Certificate details:"
    echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates -subject -issuer
else
    echo -e "${RED}❌ HTTPS not working${NC}"
fi

echo -e "\n🌐 Testing site accessibility..."
if curl -s -o /dev/null -w "%{http_code}" $HTTPS_URL | grep -q "200"; then
    echo -e "${GREEN}✅ Site is accessible${NC}"
else
    echo -e "${RED}❌ Site is not accessible${NC}"
fi

echo -e "\n🗺️  Testing sitemap..."
SITEMAP_URL="$HTTPS_URL/sitemap.xml"
if curl -s -o /dev/null -w "%{http_code}" $SITEMAP_URL | grep -q "200"; then
    echo -e "${GREEN}✅ Sitemap is accessible${NC}"
else
    echo -e "${RED}❌ Sitemap not accessible${NC}"
fi

echo -e "\n🤖 Testing robots.txt..."
ROBOTS_URL="$HTTPS_URL/robots.txt"
if curl -s -o /dev/null -w "%{http_code}" $ROBOTS_URL | grep -q "200"; then
    echo -e "${GREEN}✅ Robots.txt is accessible${NC}"
else
    echo -e "${RED}❌ Robots.txt not accessible${NC}"
fi

echo -e "\n📄 Testing key pages..."
PAGES=("/" "/company" "/privacy" "/terms" "/contact")
for page in "${PAGES[@]}"; do
    PAGE_URL="$HTTPS_URL$page"
    if curl -s -o /dev/null -w "%{http_code}" $PAGE_URL | grep -q "200"; then
        echo -e "${GREEN}✅ $page is accessible${NC}"
    else
        echo -e "${RED}❌ $page not accessible${NC}"
    fi
done

echo -e "\n🔍 Testing 404 page..."
NOT_FOUND_URL="$HTTPS_URL/nonexistent-page"
if curl -s -o /dev/null -w "%{http_code}" $NOT_FOUND_URL | grep -q "404"; then
    echo -e "${GREEN}✅ 404 page is working${NC}"
else
    echo -e "${YELLOW}⚠️  404 page may not be configured correctly${NC}"
fi

echo -e "\n📊 Performance check..."
echo "Loading time for homepage:"
curl -o /dev/null -s -w "Time: %{time_total}s\nSize: %{size_download} bytes\n" $HTTPS_URL

echo -e "\n✨ Deployment verification complete!"
echo -e "Visit your site at: ${GREEN}$HTTPS_URL${NC}"