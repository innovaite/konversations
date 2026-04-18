# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KonversAItions Website** — A custom-built marketing website for KonversAItions (AI company). The site is hosted on WordPress but serves completely custom HTML/CSS instead of using WordPress themes. Two custom WordPress plugins intercept requests and serve raw HTML files, allowing full design control independent of WordPress's theme system.

## Repository Structure

```
website/
  ├── konversaitions_v16.html                     # Home page (served at / and /home-preview/)
  ├── konversaitions_exitV16.html                 # Exit page (served at /exit/ and /exit-preview/)
  ├── konversaitions-content-preview.zip          # Plugin v1.1 (ready for deployment)
  └── CLAUDE.md                                   # This file
```

## Architecture

**WordPress + Raw HTML Plugin System:**
- The WordPress installation uses custom plugins (`KonversAItions Content Preview` and `KonversAItions Raw HTML Pages`) that intercept HTTP requests
- These plugins bypass WordPress theme rendering and serve static HTML files directly
- This approach provides full design control while maintaining WordPress as the hosting foundation
- Two plugins exist to allow preview routes (`/home-preview/`, `/exit-preview/`) and production routes (`/`, `/exit/`)

**File Organization:**
- HTML files are complete, self-contained pages with inline CSS
- Styles use CSS custom properties (variables) for theming and are embedded in `<style>` tags
- No external CSS files or JavaScript frameworks—pure HTML + vanilla CSS
- Responsive design using viewport-relative units (`clamp()`, `vw`, `vmin`)

## Development Workflow

### Editing Content

1. **Update HTML files locally** — Edit `konversaitions_v16.html` (home) or `konversaitions_exitV16.html` (exit) in any text editor
2. **Content Areas to Edit:**
   - Hero section: `.hero h1`, `.hero-sub` (main heading and subheading)
   - Section labels: Search for section titles like "Why Growth Gets Stuck", "How We Create Value", etc.
   - Sector list: Find the `.sectors` list or similar for industry sectors

### Deployment

**Manual Upload via WordPress Admin (Recommended for CAPTCHA Protection):**
1. Navigate to: `https://konversaitions.com/wp-admin/plugin-install.php?tab=upload`
2. Click "Choose File" button to open browser file picker
3. Select the prepared plugin ZIP file
4. Click "Install Now" to deploy
5. Verify activation in WordPress Admin → Plugins

**Plugin Package Structure:**
- ZIP archive contains:
  ```
  konversaitions-content-preview/
    ├── konversaitions-content-preview.php    # Plugin file with routing logic
    ├── home.html                              # Updated home page (from konversaitions_v16.html)
    └── exit.html                              # Updated exit page (from konversaitions_exitV16.html)
  ```
- The plugin PHP file must contain routing logic that intercepts `/`, `/exit/`, `/home-preview/`, and `/exit-preview/` requests
- Plugin must set v1.1 in header to differentiate from legacy v1.0

**CAPTCHA Note:** WordPress has security protections on the plugin upload endpoint to prevent automated attacks. Manual browser-based upload is the reliable method.

## Key Technical Details

### HTML Structure
- Complete `<!DOCTYPE html>` with proper meta tags
- Responsive viewport configuration
- Google Fonts integration for 'Newsreader' (serif) and 'Inter' (sans-serif)
- Dark theme using navy/teal/gold color scheme

### CSS Architecture
- CSS custom properties defined in `:root` for:
  - Colors: `--navy`, `--teal`, `--lteal`, `--gold`, `--surface`, etc.
  - Text variants: `--on-navy`, `--on-navy-muted`, `--on-navy-faint`
- Utility classes for animations: `.fade`, `.fade.in`, `.d1`, `.d2`, `.d3` (delay cascades)
- Flexbox-based layout with responsive `clamp()` for typography
- Smooth transitions and hover states for interactivity

### Naming Conventions
- BEM-style class names for components: `.nav`, `.logo`, `.nav-links`, `.hero`, `.hero-ey`, `.hero-sub`
- State classes: `.in` (for animation states), `.active` (for navigation)
- Utility prefixes: `.d1`, `.d2`, `.d3` (animation delays), `.btn-*` (button variants)

## Common Tasks

**Update website copy:**
1. Edit `konversaitions_v16.html` or `konversaitions_exitV16.html` directly
2. Search for the text you want to change (e.g., search for section headings)
3. Update and save
4. Test locally by opening the HTML file in a browser
5. Deploy via WordPress plugin upload

**Add/modify sections:**
1. Find the relevant section div (e.g., `.hero`, `.section`, `.faq`)
2. Update HTML structure and inline CSS as needed
3. Ensure all CSS for the new section is included in the `<style>` tag
4. Test responsiveness with browser DevTools (check mobile, tablet, desktop)

**Update colors or spacing:**
1. Modify CSS custom properties in `:root` section for site-wide changes
2. Or update specific component styles within their CSS rule sets
3. All styling is self-contained in the `<style>` tag—no external CSS files

## Recent Updates & Deployment Status (April 2026)

**Plugin v1.1 Created** ✅
- Updated `KonversAItions Content Preview` plugin to v1.1
- Plugin now serves main production routes (`/`, `/exit/`) in addition to preview routes (`/home-preview/`, `/exit-preview/`)
- Allows full content override of the legacy `KonversAItions Raw HTML Pages` plugin

**Content Changes Applied** ✅
- Hero subhead updated to: "founders and executive teams unlock revenue, expand margins"
- Section label changes:
  - "Why AI. Why Now..." → "Why Growth Gets Stuck"
  - "The Full Arc" → "How We Create Value"  
  - "The Real AI Problem" → "Why Change Fails"
- Exit page sector list updated to: "SaaS. Communications. Political Tech. Energy. Healthcare. Education"

**Deployment Status** ⏸️
- v1.1 plugin ZIP created and verified: `/tmp/konversaitions-content-preview.zip` (23.9KB)
- **Blocker:** WordPress upload endpoint protected by CAPTCHA (prevents automated uploads)
- **Solution:** Upload manually through WordPress Admin UI using browser file picker
  
**Next Steps:**
1. Navigate to `https://konversaitions.com/wp-admin/plugin-install.php?tab=upload`
2. Click "Choose File" and select the plugin ZIP
3. Click "Install Now" to deploy v1.1
4. Once activated, the site will serve updated content at `/` and `/exit/`

## WordPress Plugin Details

The site uses plugins for serving raw HTML:
1. **KonversAItions Content Preview (currently v1.0, should upgrade to v1.1)** — Routes `/`, `/exit/`, `/home-preview/`, `/exit-preview/` to HTML files
2. **KonversAItions Raw HTML Pages (v1.0)** — Legacy plugin for backward compatibility

Plugin files are located in WordPress's `/wp-content/plugins/` directory on the server. To update:
- Package updated HTML files with plugin PHP in a ZIP
- Upload via WordPress Admin → Plugins → Add Plugin
- Activate to override previous version

## Testing

- **Local Testing:** Open HTML files directly in any browser to check layout and styles
- **Responsive Testing:** Use browser DevTools (F12) to test different viewport sizes
- **Live Testing:** After deployment, visit `https://konversaitions.com/` and `/exit/` to verify changes are live
- **Preview Routes:** Test at `/home-preview/` and `/exit-preview/` before publishing to main routes

## Troubleshooting

**Plugin won't upload:**
- Clear browser cache
- Try uploading via private/incognito window
- Check file permissions on uploaded ZIP
- If CAPTCHA blocks, use browser file picker (manual upload)

**Changes not appearing:**
- Clear WordPress cache (if caching plugin is active)
- Verify plugin is activated in WordPress Admin
- Check that HTML file names match plugin PHP routing logic
- Ensure no other plugins are conflicting with routing

**Styling looks broken:**
- Verify CSS custom properties are defined in `:root`
- Check that all CSS is inline in the `<style>` tag (no external sheets)
- Test in multiple browsers (Chrome, Safari, Firefox) for compatibility
- Use browser DevTools to inspect and debug specific elements
