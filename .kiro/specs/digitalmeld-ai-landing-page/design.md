# Design Document

## Overview

The DigitalMeld.ai landing page will be a modern, responsive website built with Jekyll and hosted on GitHub Pages. The design follows a dark-mode-first approach with clean, minimal aesthetics inspired by Material UI and the provided reference image. The site architecture supports both current landing page needs and future evolution into a multi-tenant SaaS platform.

## Architecture

### Technology Stack
- **Static Site Generator**: Jekyll (GitHub Pages native)
- **Hosting**: GitHub Pages with custom domain support
- **Styling**: SCSS with Material UI-inspired design system
- **JavaScript**: Vanilla JS with progressive enhancement
- **Build Process**: GitHub Actions for automated deployment
- **Content Management**: Markdown files with YAML front matter

### Site Structure
```
digitalmeld-ai/
├── _config.yml                 # Jekyll configuration
├── CNAME                      # Custom domain configuration
├── index.html                 # Landing page
├── _layouts/
│   ├── default.html          # Base layout
│   └── page.html             # Page layout
├── _includes/
│   ├── header.html           # Navigation component
│   ├── footer.html           # Footer component
│   └── hero.html             # Hero section component
├── _sass/
│   ├── _variables.scss       # Design tokens
│   ├── _base.scss           # Base styles
│   ├── _components.scss     # Component styles
│   └── _layout.scss         # Layout styles
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── pages/
│   ├── product.md
│   ├── how-it-works.md
│   ├── features.md
│   ├── mission.md
│   └── company.md
└── 404.html                  # Custom error page
```

## Components and Interfaces

### Navigation Component
- **Sticky header** with DigitalMeld.ai logo
- **Primary navigation**: Product, How it works, Features, Mission, Company
- **Theme toggle** for light/dark mode switching
- **Mobile-responsive** hamburger menu
- **Smooth scrolling** to page sections

### Hero Section
- **Gradient background** with purple-to-dark theme matching reference image
- **Primary headline**: "Unlock the Potential of AI at the Edge"
- **Subheadline**: Value proposition about transforming operations
- **Call-to-action buttons**: "Learn More" and "Watch Demo"
- **Product showcase mockup**: Visual representation of Rubicon interface

### Product Showcase
- **Three-column layout** for Rubicon variants:
  - Rubicon Safety (Industrial/Operational)
  - Rubicon Safety for Public Sector
  - Rubicon Perception (Data Analytics)
- **Feature cards** with icons, descriptions, and capability lists
- **Interactive elements** with hover effects and smooth transitions

### Features Section
- **Grid layout** showcasing key capabilities:
  - Real-time AI monitoring
  - Cloud and edge deployment
  - Existing infrastructure integration
  - Compliance and safety features
- **Visual icons** and brief descriptions
- **Statistics display** (similar to reference image metrics)

### Company Information
- **About section** linking to DigitalMeld.io background
- **Mission statement** and value proposition
- **Technology expertise** highlighting AI, automation, and process improvement
- **Contact information** and social links

### Footer
- **Multi-column layout** with:
  - Company information
  - Product links
  - Legal pages (Privacy, Terms)
  - Social media links
- **Newsletter signup** for future updates
- **Copyright and branding** information

## Data Models

### Site Configuration (_config.yml)
```yaml
title: DigitalMeld.ai
description: AI-Powered Operational Intelligence
url: https://digitalmeld.ai
baseurl: ""
theme: minima
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag

# Site settings
company:
  name: DigitalMeld
  tagline: "Unlock the Potential of AI at the Edge"
  email: contact@digitalmeld.ai
  
# Navigation
navigation:
  - name: Product
    url: /#product
  - name: How it works
    url: /#how-it-works
  - name: Features
    url: /#features
  - name: Mission
    url: /#mission
  - name: Company
    url: /company

# Product information
products:
  rubicon:
    name: Rubicon
    tagline: "Advanced AI for Operational Challenges"
    variants:
      - name: "Rubicon Safety"
        description: "Industrial safety and compliance monitoring"
        features: ["PPE Compliance", "Zone Monitoring", "Fire & Smoke Detection", "Methane Detection", "Re-identification"]
      - name: "Rubicon Safety for Public Sector"
        description: "Situational awareness and incident response"
        features: ["People & Asset Tracking", "Action & Incident Monitoring", "Time & Location Analysis"]
      - name: "Rubicon Perception"
        description: "Data transformation and insights"
        features: ["Process Control", "Weather Analysis", "Predictive Maintenance"]
```

### Page Front Matter Structure
```yaml
---
layout: page
title: Page Title
description: Page description for SEO
permalink: /page-url/
---
```

## Design System

### Color Palette
```scss
// Primary colors (inspired by reference image)
$primary-purple: #8B5CF6;
$primary-dark: #1F2937;
$primary-black: #111827;

// Accent colors
$accent-blue: #3B82F6;
$accent-green: #10B981;
$accent-orange: #F59E0B;

// Neutral colors
$white: #FFFFFF;
$gray-50: #F9FAFB;
$gray-100: #F3F4F6;
$gray-200: #E5E7EB;
$gray-300: #D1D5DB;
$gray-400: #9CA3AF;
$gray-500: #6B7280;
$gray-600: #4B5563;
$gray-700: #374151;
$gray-800: #1F2937;
$gray-900: #111827;

// Theme variables
$bg-dark: $gray-900;
$bg-light: $white;
$text-dark: $white;
$text-light: $gray-900;
```

### Typography
```scss
// Font families
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
$font-mono: 'JetBrains Mono', 'Fira Code', monospace;

// Font sizes
$text-xs: 0.75rem;
$text-sm: 0.875rem;
$text-base: 1rem;
$text-lg: 1.125rem;
$text-xl: 1.25rem;
$text-2xl: 1.5rem;
$text-3xl: 1.875rem;
$text-4xl: 2.25rem;
$text-5xl: 3rem;
$text-6xl: 3.75rem;

// Font weights
$font-light: 300;
$font-normal: 400;
$font-medium: 500;
$font-semibold: 600;
$font-bold: 700;
```

### Spacing and Layout
```scss
// Spacing scale
$space-1: 0.25rem;
$space-2: 0.5rem;
$space-3: 0.75rem;
$space-4: 1rem;
$space-5: 1.25rem;
$space-6: 1.5rem;
$space-8: 2rem;
$space-10: 2.5rem;
$space-12: 3rem;
$space-16: 4rem;
$space-20: 5rem;
$space-24: 6rem;

// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

## User Experience Flow

### Landing Page Journey
1. **Hero Section**: Immediate value proposition and visual appeal
2. **Product Overview**: Quick introduction to Rubicon capabilities
3. **How It Works**: Technical explanation and deployment options
4. **Features**: Detailed capability breakdown
5. **Mission**: Company purpose and values
6. **Company**: Background and expertise
7. **Call-to-Action**: Contact or demo request

### Navigation Patterns
- **Single-page application** with smooth scrolling between sections
- **Sticky navigation** for easy access to all sections
- **Mobile-first responsive** design with collapsible menu
- **Progressive disclosure** of information to avoid overwhelming users

### Interactive Elements
- **Hover effects** on cards and buttons
- **Smooth transitions** between states
- **Loading animations** for dynamic content
- **Theme switching** with persistent user preference

## Error Handling

### 404 Error Page
- **Custom design** matching site aesthetic
- **Helpful navigation** back to main sections
- **Search functionality** for finding content
- **Contact information** for reporting issues

### Performance Optimization
- **Image optimization** with responsive images and lazy loading
- **CSS/JS minification** through Jekyll build process
- **CDN delivery** through GitHub Pages
- **Caching strategies** for static assets

### Accessibility
- **WCAG 2.1 AA compliance** for all interactive elements
- **Keyboard navigation** support
- **Screen reader compatibility** with proper ARIA labels
- **Color contrast** meeting accessibility standards
- **Focus indicators** for all interactive elements

## Testing Strategy

### Cross-Browser Testing
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile browsers**: iOS Safari, Chrome Mobile
- **Legacy support**: IE11 graceful degradation

### Performance Testing
- **Lighthouse audits** for performance, accessibility, SEO
- **Core Web Vitals** monitoring
- **Mobile performance** optimization
- **Load time targets**: < 3 seconds on 3G

### Content Testing
- **Markdown rendering** verification
- **Link validation** across all pages
- **SEO optimization** with meta tags and structured data
- **Social media previews** with Open Graph tags

### Responsive Testing
- **Mobile-first** design verification
- **Tablet and desktop** layout testing
- **Touch interaction** optimization
- **Print styles** for offline reading

## Future Considerations

### SaaS Platform Evolution
- **Subdomain architecture** preparation (companyname.digitalmeld.ai)
- **Authentication system** integration points
- **Dashboard layout** foundation
- **Multi-tenant** design patterns

### Content Management
- **Blog integration** with Jekyll posts
- **Case studies** and success stories
- **Documentation** system for API and features
- **Localization** support for international markets

### Analytics and Tracking
- **Google Analytics** integration
- **Conversion tracking** for lead generation
- **User behavior** analysis
- **A/B testing** framework for optimization