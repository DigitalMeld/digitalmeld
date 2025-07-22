# DigitalMeld.ai Deployment Guide

## GitHub Pages Configuration

This site is deployed using GitHub Pages with Jekyll. The deployment is automated through GitHub Actions.

### Repository Settings

1. **GitHub Pages Source**: Deploy from GitHub Actions (recommended)
2. **Custom Domain**: digitalmeld.ai (configured via CNAME file)
3. **HTTPS**: Enforced automatically by GitHub Pages
4. **Branch**: Deploys from `main` branch

### Deployment Process

#### Automatic Deployment
- Pushes to `main` branch trigger automatic deployment via GitHub Actions
- Build process runs Jekyll with production environment
- Site is deployed to GitHub Pages automatically
- SSL certificate is managed automatically by GitHub

#### Manual Deployment
To manually trigger deployment:
1. Go to Actions tab in GitHub repository
2. Select "Deploy Jekyll site to Pages" workflow
3. Click "Run workflow" button
4. Select `main` branch and run

### Build Process

The site uses the following build pipeline:

1. **Setup**: Ruby 3.1 environment with bundler cache
2. **Dependencies**: Install gems via `bundle install`
3. **Build**: Run `jekyll build` with production environment
4. **Deploy**: Upload to GitHub Pages

### Custom Domain Configuration

The custom domain `digitalmeld.ai` is configured via:
- `CNAME` file in repository root
- DNS A records pointing to GitHub Pages IPs:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

### SSL Certificate

- SSL certificate is automatically provisioned by GitHub Pages
- Certificate auto-renews before expiration
- HTTPS is enforced for all traffic

### Monitoring and Testing

#### Build Status
- Check GitHub Actions tab for build status
- Failed builds will show error details in workflow logs

#### Site Health Checks
- Automated HTML validation in test workflow
- Link checking for broken internal/external links
- SEO and accessibility validation

#### Performance Monitoring
- Lighthouse CI can be added for performance monitoring
- Core Web Vitals tracking via Google Analytics (when configured)

### Troubleshooting

#### Common Issues

1. **Build Failures**
   - Check GitHub Actions logs for detailed error messages
   - Verify Gemfile.lock is up to date
   - Ensure all required gems are properly specified

2. **Custom Domain Issues**
   - Verify CNAME file contains correct domain
   - Check DNS configuration with `dig digitalmeld.ai`
   - Allow 24-48 hours for DNS propagation

3. **SSL Certificate Issues**
   - GitHub automatically manages SSL certificates
   - If issues persist, remove and re-add custom domain in repository settings

#### Debug Commands

Local development and testing:
```bash
# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# Build for production
JEKYLL_ENV=production bundle exec jekyll build

# Test build
bundle exec htmlproofer ./_site --check-html --check-img-http
```

### Content Updates

#### Adding New Pages
1. Create new `.html` or `.md` file in root or appropriate directory
2. Add proper front matter with layout and metadata
3. Update navigation in `_config.yml` if needed
4. Commit and push to trigger deployment

#### Updating Configuration
1. Modify `_config.yml` for site-wide settings
2. Update `_data/` files for structured content
3. Test locally before pushing to production

#### Asset Management
- Images: Place in `assets/images/`
- CSS: Modify SCSS files in `_sass/`
- JavaScript: Place in `assets/js/`
- Optimize images before committing

### Security Considerations

- Repository is public (required for free GitHub Pages)
- Sensitive data should never be committed
- Use environment variables for API keys (not applicable for static site)
- Regular dependency updates via Dependabot

### Backup and Recovery

- Source code is version controlled in GitHub
- GitHub Pages provides built-in redundancy
- Site can be rebuilt from any commit in repository
- Export site data regularly if using dynamic features

### Performance Optimization

- Jekyll builds are cached for faster subsequent builds
- Assets are automatically compressed in production
- CDN delivery via GitHub Pages infrastructure
- Image optimization should be done before upload

### Future Enhancements

- Consider GitHub Actions for automated testing
- Add performance monitoring with Lighthouse CI
- Implement automated security scanning
- Set up staging environment for testing changes