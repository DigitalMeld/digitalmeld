# DigitalMeld.ai - AI-Powered Operational Intelligence

A modern, responsive website for DigitalMeld.ai showcasing Rubicon, our advanced AI platform for operational excellence. Built with Jekyll and optimized for performance, accessibility, and SEO.

## 🚀 About DigitalMeld.ai

DigitalMeld.ai transforms operations through real-time AI monitoring and analytics at the edge. Our flagship product, Rubicon, delivers enterprise-grade artificial intelligence for:

- **Industrial Safety**: PPE compliance, zone monitoring, fire & smoke detection, methane detection
- **Public Sector**: Situational awareness, incident response, asset tracking  
- **Predictive Analytics**: Process optimization, maintenance scheduling, performance insights
- **Multi-Sensor Fusion**: Cameras, LiDAR, radar, thermal, and inertial sensor integration

## ✨ Features

### Site Structure
- **Homepage**: Hero section, product showcase, core functionality (2x2 grid), features, and mission with integrated CTA buttons
- **Company Page**: About us, our story, values (2x2 grid), and leadership team (side-by-side layout)
- **Unified Footer**: "Get in Touch" section with contact information, social media, and call-to-action across all pages

### Design Highlights
- **2x2 Grid Layouts**: Core functionality showcase and company values in balanced square formations
- **Side-by-Side Team Display**: Leadership team members displayed horizontally with enhanced styling
- **Integrated CTAs**: Call-to-action buttons seamlessly integrated into the values grid
- **Professional Footer**: Comprehensive "Get in Touch" section with contact details and social media

### Technical Excellence
- **Responsive Design**: Mobile-first approach with optimized breakpoints for all screen sizes
- **Performance Optimized**: Lazy loading, image optimization, compressed assets
- **SEO Ready**: Structured data, Open Graph tags, XML sitemap
- **Accessibility Compliant**: WCAG 2.1 AA standards with keyboard navigation
- **Dark/Light Mode**: User preference with localStorage persistence

### Content Management
- **Jekyll-Powered**: Static site generation with Markdown support
- **Component-Based**: Reusable includes for maintainable code
- **Configuration-Driven**: Easy content updates via `_config.yml`
- **Streamlined Navigation**: Clean, focused user experience without redundant pages

## 🛠 Development

### Prerequisites
- Ruby 2.7+ with Bundler
- Jekyll 4.0+
- Node.js (for asset optimization)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/digitalmeld/digitalmeld-ai-landing-page.git
cd digitalmeld-ai-landing-page

# Install dependencies
bundle install

# Run development server
bundle exec jekyll serve --livereload

# Open in browser
open http://localhost:4000
```

## 📁 Project Structure

```
digitalmeld-ai/
├── _config.yml              # Site configuration
├── _layouts/                # Page templates
├── _includes/               # Reusable components (header, footer, hero)
├── _sass/                   # SCSS stylesheets
│   ├── _variables.scss      # Design tokens and variables
│   ├── _base.scss          # Base styles and resets
│   └── _components.scss    # Component-specific styles
├── assets/                  # Static assets
│   ├── css/                # Compiled stylesheets
│   ├── js/                 # JavaScript files
│   └── images/             # Product screenshots and team photos
├── .kiro/                  # Kiro IDE specifications
│   └── specs/              # Feature specifications and tasks
├── index.html              # Homepage with hero, products, and features
├── company.html            # Company page with team and values
└── 404.html               # Custom error page
```

## 🚀 Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

## 📞 Support

- **Email**: [contact@digitalmeld.ai](mailto:contact@digitalmeld.ai)
- **Website**: [DigitalMeld.io](https://digitalmeld.io)

---

**Built with ❤️ by the DigitalMeld team**
