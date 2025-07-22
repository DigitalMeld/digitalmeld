# DigitalMeld.ai Maintenance Guide

## Content Updates and Maintenance

This guide provides instructions for maintaining and updating the DigitalMeld.ai website.

### Table of Contents
- [Content Management](#content-management)
- [Analytics Configuration](#analytics-configuration)
- [Performance Monitoring](#performance-monitoring)
- [Regular Maintenance Tasks](#regular-maintenance-tasks)
- [Troubleshooting](#troubleshooting)

## Content Management

### Updating Site Configuration

The main site configuration is in `_config.yml`. Key sections to update:

```yaml
# Company information
company:
  name: DigitalMeld
  tagline: "Unlock the Potential of AI at the Edge"
  email: contact@digitalmeld.ai

# Analytics configuration
google_analytics: GA_TRACKING_ID  # Add your Google Analytics tracking ID
gtag: GA4_MEASUREMENT_ID          # Add your GA4 measurement ID (G-XXXXXXXXXX)

# Product information
products:
  rubicon:
    variants:
      - name: "Rubicon Safety"
        features: ["PPE Compliance", "Zone Monitoring", ...]
```

### Adding New Pages

1. Create a new `.html` or `.md` file in the root directory
2. Add front matter:
```yaml
---
layout: default
title: Page Title
description: Page description for SEO
permalink: /page-url/
---
```
3. Update navigation in `_config.yml` if needed
4. Commit and push to trigger deployment

### Updating Product Information

Product details are configured in `_config.yml` under the `products` section:

```yaml
products:
  rubicon:
    variants:
      - name: "Product Name"
        description: "Product description"
        features:
          - "Feature 1"
          - "Feature 2"
```

### Managing Images

- Place images in `assets/images/`
- Use descriptive filenames
- Optimize images before uploading (recommended: WebP format)
- Update image references in content files

### Updating Styles

- Main styles are in `_sass/` directory
- Variables are in `_sass/_variables.scss`
- Components are in `_sass/_components.scss`
- Test locally before deploying

## Analytics Configuration

### Setting Up Google Analytics 4

1. Create a Google Analytics 4 property
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Update `_config.yml`:
```yaml
gtag: G-XXXXXXXXXX  # Replace with your actual measurement ID
```
4. Deploy the site

### Conversion Goals

The site tracks these conversion events automatically:
- `contact_form_submit` - Contact form submissions (value: 10)
- `demo_request` - Demo request button clicks (value: 25)
- `newsletter_signup` - Newsletter signups (value: 5)
- `product_interest` - Product interest interactions (value: 15)
- `download_resource` - Resource downloads (value: 8)
- `video_watch_complete` - Video completion (value: 12)

### Custom Event Tracking

Add custom tracking to any element:

```html
<!-- Track button clicks -->
<button onclick="DigitalMeldAnalytics.trackButtonClick('Button Name', 'section')">
  Click Me
</button>

<!-- Track conversions -->
<button onclick="DigitalMeldAnalytics.trackConversion('demo_request')">
  Request Demo
</button>

<!-- Track custom events -->
<button onclick="DigitalMeldAnalytics.track('custom_event', {event_category: 'engagement'})">
  Custom Action
</button>
```

### Analytics Dashboard Setup

Recommended Google Analytics 4 reports to create:

1. **Lead Generation Report**
   - Conversion events: contact_form_submit, demo_request
   - Dimensions: Source/Medium, Page path
   - Metrics: Conversions, Conversion rate

2. **Engagement Report**
   - Events: scroll_depth, engagement_milestone, form_start
   - Dimensions: Page title, User type
   - Metrics: Engaged sessions, Average engagement time

3. **Performance Report**
   - Custom metrics: Core Web Vitals
   - Dimensions: Device category, Connection type
   - Metrics: Page load time, Bounce rate

## Performance Monitoring

### Core Web Vitals Tracking

The site automatically tracks:
- **Largest Contentful Paint (LCP)** - Target: < 2.5s
- **First Input Delay (FID)** - Target: < 100ms
- **Cumulative Layout Shift (CLS)** - Target: < 0.1

### Performance Optimization Checklist

Monthly performance review:

- [ ] Check Lighthouse scores (target: 90+ for all metrics)
- [ ] Review Core Web Vitals in Google Analytics
- [ ] Optimize slow-loading resources
- [ ] Compress and optimize new images
- [ ] Review and minify CSS/JS if needed
- [ ] Test mobile performance

### Monitoring Tools

1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **GTmetrix**: https://gtmetrix.com/
3. **WebPageTest**: https://www.webpagetest.org/
4. **Google Search Console**: Monitor search performance

## Regular Maintenance Tasks

### Weekly Tasks

- [ ] Review analytics for unusual traffic patterns
- [ ] Check for broken links using site verification script
- [ ] Monitor form submissions and contact requests
- [ ] Review error logs in GitHub Actions

### Monthly Tasks

- [ ] Update dependencies in Gemfile
- [ ] Review and update product information
- [ ] Analyze conversion funnel performance
- [ ] Update blog content or news (if applicable)
- [ ] Review and update SEO meta descriptions

### Quarterly Tasks

- [ ] Comprehensive SEO audit
- [ ] Review and update privacy policy/terms
- [ ] Analyze competitor websites for improvements
- [ ] Update company information and team details
- [ ] Review and optimize conversion paths

### Annual Tasks

- [ ] Renew domain registration
- [ ] Review and update brand assets
- [ ] Comprehensive site redesign evaluation
- [ ] Update copyright year in footer
- [ ] Review and update structured data

## Troubleshooting

### Common Issues

#### Site Not Building

1. Check GitHub Actions for build errors
2. Verify Jekyll configuration syntax
3. Check for missing dependencies in Gemfile
4. Ensure all required files are present

#### Analytics Not Working

1. Verify Google Analytics ID is correct in `_config.yml`
2. Check that site is in production mode
3. Test with Google Analytics Debugger extension
4. Verify tracking code is present in page source

#### Performance Issues

1. Run Lighthouse audit to identify issues
2. Check for large unoptimized images
3. Review JavaScript execution time
4. Verify CDN and caching are working

#### Form Submissions Not Working

1. Check form action URLs
2. Verify form validation JavaScript
3. Test form submission tracking in analytics
4. Check for JavaScript errors in console

### Getting Help

1. **GitHub Issues**: Create issues in the repository for bugs
2. **Jekyll Documentation**: https://jekyllrb.com/docs/
3. **GitHub Pages Documentation**: https://docs.github.com/en/pages
4. **Google Analytics Help**: https://support.google.com/analytics/

### Emergency Procedures

#### Site Down

1. Check GitHub Pages status: https://www.githubstatus.com/
2. Verify DNS settings for custom domain
3. Check repository settings for Pages configuration
4. Review recent commits for breaking changes

#### Security Issues

1. Immediately remove sensitive information if committed
2. Rotate any exposed API keys or credentials
3. Review access logs for suspicious activity
4. Update dependencies if security vulnerabilities found

#### Data Loss

1. All content is version controlled in Git
2. Restore from previous commit if needed
3. GitHub provides backup and recovery options
4. Contact GitHub support for critical issues

## Contact Information

For technical issues or questions about maintenance:
- **Repository**: https://github.com/digitalmeld/digitalmeld-ai
- **Technical Contact**: [technical-contact@digitalmeld.ai]
- **Emergency Contact**: [emergency@digitalmeld.ai]

## Change Log

Keep track of major changes and updates:

### 2024-07-21
- Initial deployment configuration
- Google Analytics 4 integration
- Performance monitoring setup
- Conversion tracking implementation

---

*Last updated: July 21, 2024*
*Next review: August 21, 2024*