# System 2 ML Lab Website - UI/UX Improvement Plan

## 📅 Last Updated: 2025-10-05 (Latest Session)

---

## 🔍 Executive Summary

This document outlines a comprehensive improvement plan for the System 2 ML Lab website based on competitive analysis of top university research lab websites (Berkeley BAIR, KAIST KIXLAB, Stanford HAI) and current website audit.

### Current Strengths
- ✅ Server-side rendering (SSR) for fast loading
- ✅ Dynamic news carousel on homepage
- ✅ Admin CMS system for content management
- ✅ Responsive design (mobile/desktop)
- ✅ Database-backed (Prisma + PostgreSQL)
- ✅ Clean, academic color palette
- ✅ Unified Footer component across all pages
- ✅ CSS variables for consistent typography
- ✅ Publications filtering system (Year, Venue, Topic, Search)
- ✅ Consistent Join Us CTA on all pages

### Recently Completed Improvements ✨
- ✅ **Footer Unification** - Single Footer component used across all pages
- ✅ **Typography Standardization** - CSS variables for font sizes (--font-size-*)
- ✅ **Publications Filtering** - Year, Venue, Topic filters + search functionality
- ✅ **Publications UI Redesign** - Compact menu bar filters (dropdown style)
- ✅ **Consistent Join Us Sections** - Shared JoinUs component on all pages
- ✅ **Page Layout Consistency** - All pages use 900px max-width, left-aligned

### Key Areas for Improvement
- ✅ Research and News pages removed (content integrated into About Us and Homepage)
- ✅ Homepage design kept clean and simple (decision: no CTA buttons needed)
- ⚠️ Publications page filtering complete, but needs database integration
- ❌ Insufficient Professor profile integration (needs photo)
- ✅ Call-to-action elements complete (Join Us component on all pages)
- ✅ Lab Statistics decided against (keeps About Us clean)
- ❌ Limited storytelling in Gallery page

---

## 🎯 Prioritized Improvement Roadmap

### 🔴 **P0 - CRITICAL PRIORITY** (Start Immediately - Week 1-2)

#### 1. Research Page Implementation ⭐⭐⭐
**Status:** Currently Empty Page
**Impact:** HIGH - Core content missing
**Effort:** MEDIUM (2-3 days)

**Implementation:**
- [ ] Create 6 research area sections:
  - Large Language Model Reasoning
  - System 2 Deep Learning
  - Meta-Learning
  - AutoML
  - Bayesian Inference
  - Generative Flow Networks
- [ ] Each section includes:
  - 2-3 paragraph description
  - 3-5 representative publications
  - Ongoing projects list
  - Related images/diagrams
- [ ] KIXLAB-style card view with click-to-expand
- [ ] Hero section with research philosophy statement

**Design Reference:** KIXLAB research themes section

---

#### 2. Homepage Hero Section Enhancement ⭐⭐⭐ ✅ DECIDED AGAINST
**Status:** ✅ Keeping current clean design
**Impact:** HIGH - First impression
**Decision:** Homepage simplicity is a strength, no changes needed

**Rationale:**
- Current homepage is clean and elegant
- News carousel at bottom provides dynamic content
- Adding CTA buttons would conflict with News section
- Minimalist design aligns with academic aesthetic
- Join Us CTAs already present on all other pages

**Conclusion:** Homepage kept as-is

---

#### 3. Publications Page UX Overhaul ⭐⭐ ✅ COMPLETED
**Status:** ✅ Filtering system implemented
**Impact:** HIGH - Showcase research output
**Effort:** COMPLETED

**✅ Implemented:**
- [x] **Filtering System:**
  - Year dropdown (All, 2025, 2024, 2022)
  - Venue dropdown (All, NeurIPS, ICML, ICLR)
  - Topic dropdown (All, AutoML, Bayesian Inference, GFlowNets, LLM, Meta-Learning)
  - "Clear Filters" button (shows when filters active)
- [x] **Search Functionality:**
  - Real-time search by title/author/abstract
  - Compact menu bar design (dropdown style)
- [x] **Header Statistics:**
  - "Total XX Publications"
  - "Showing YY" (when filtered)
- [x] **Topic Tags:**
  - Visual topic tags on each publication card
- [x] **Join Us Section:**
  - Replaced "Research Areas" with shared JoinUs component

**🔄 Future Enhancements (Optional):**
- [ ] Database integration for publications
- [ ] PDF download buttons
- [ ] BibTeX copy button
- [ ] View mode toggle (List/Grid)
- [ ] Citation counts

**Design Reference:** Compact dropdown filters implemented

---

#### 4. About Us Page - Professor Profile Enhancement ⭐⭐
**Status:** Text-only, lacks visual impact
**Impact:** HIGH - Build credibility
**Effort:** LOW (1 day)

**Implementation:**
- [ ] Add professional headshot of Professor Lee (large, prominent)
- [ ] Highlight key achievements in callout boxes:
  - "Collaborated with Yoshua Bengio at Mila"
  - "Published at NeurIPS, ICML, ICLR"
  - "Postdoc at KAIST & Mila"
- [ ] Add "Research Philosophy" narrative section (storytelling)
- [ ] Link to personal website with icon
- [ ] Add "Contact for Collaboration" button

**Design Reference:** Professor Lee's personal site + KIXLAB people page

---

### 🟡 **P1 - HIGH PRIORITY** (Week 3-4)

#### 5. News Page Implementation ⭐⭐
**Status:** Currently Empty Page
**Impact:** MEDIUM - Keep website dynamic
**Effort:** MEDIUM (2 days)

**Implementation:**
- [ ] Card-based layout (date, title, summary, image)
- [ ] Category filters:
  - All News
  - Publications
  - Awards
  - Events
  - Student News
- [ ] Pagination (10 items per page)
- [ ] Admin interface to add/edit news items
- [ ] RSS feed for automatic updates

---

#### 6. About Us Page - Lab Statistics Section ⭐⭐ ✅ DECIDED AGAINST
**Status:** ✅ Not implementing to maintain simplicity
**Impact:** MEDIUM - Build credibility
**Decision:** About Us page is already comprehensive, statistics would add clutter

**Rationale:**
- About Us already has 5 sections (Lab Director, Mission, Philosophy, Research Areas, Join Us)
- Research Areas grid already provides visual richness
- Publications count visible on Publications page
- Student count visible on People page
- Statistics would make page feel crowded
- Current clean design is a strength

**Conclusion:** No statistics section added

---

#### 7. People Page Enhancement ⭐
**Status:** Basic grid, lacks detail
**Impact:** MEDIUM - Showcase team
**Effort:** MEDIUM (1-2 days)

**Implementation:**
- [ ] Separate Professor section (featured prominently)
- [ ] Enhanced student profiles:
  - Larger photos
  - Research interest tags (clickable → filter publications)
  - Personal website / GitHub / Scholar links
  - Hover effect showing detailed info
- [ ] Alumni section:
  - Where they are now (company/university)
  - Year graduated
- [ ] "Join Our Team" CTA at bottom

---

#### 8. About Us Page - Lab Timeline ⭐
**Status:** Missing historical context
**Impact:** MEDIUM - Show growth
**Effort:** MEDIUM (1 day)

**Implementation:**
- [ ] Vertical timeline showing:
  - 2023: Lab founded at Korea University
  - Key milestones (first publication, grants, awards)
  - Student achievements
- [ ] Interactive timeline (click year → expand details)
- [ ] Visual timeline component with animations

---

#### 9. Design System Documentation ⭐ ✅ PARTIALLY COMPLETED
**Status:** ✅ Typography standardized, layout consistency achieved
**Impact:** HIGH - Consistency
**Effort:** COMPLETED

**✅ Implemented:**
- [x] **CSS Variables for Typography:**
  - `--font-size-page-title`: Page headings (h1)
  - `--font-size-section-title`: Section headings (h2)
  - `--font-size-card-title`: Card titles (h3)
  - `--font-size-subtitle`, `--font-size-body`, `--font-size-small`, `--font-size-caption`
- [x] **Shared Components:**
  - Footer.tsx (unified across all pages)
  - JoinUs.tsx (consistent CTA on all pages)
- [x] **Layout Consistency:**
  - All pages: 900px max-width, left-aligned
  - Responsive padding: `clamp(1rem, 3vw, 2rem)`

**🔄 Remaining Tasks:**
- [ ] Document design system in `design-system.md`
- [ ] Create shared color variables
- [ ] Standardize spacing system

---

### 🟢 **P2 - MEDIUM PRIORITY** (Week 5-6)

#### 10. Gallery Page Storytelling Enhancement
**Status:** Photo grid only, no context
**Impact:** LOW - Secondary content
**Effort:** MEDIUM (1 day)

**Implementation:**
- [ ] Category tabs:
  - Lab Events
  - Conference Trips
  - Team Building
  - Research Presentations
- [ ] Photo captions (date + description)
- [ ] Lightbox view (click → full screen)
- [ ] Masonry grid layout for visual variety

---

#### 11. Courses Page Expansion
**Status:** Too minimal
**Impact:** LOW - Limited audience
**Effort:** LOW (0.5 day)

**Implementation:**
- [ ] Each course includes:
  - Course syllabus link (PDF)
  - Semester/schedule information
  - Student testimonials (optional)
  - Sample projects (if available)
- [ ] "Upcoming Courses" section
- [ ] Prerequisites and enrollment info

---

#### 12. SEO & Technical Optimization
**Status:** Basic metadata only
**Impact:** MEDIUM - Discoverability
**Effort:** MEDIUM (2 days)

**Implementation:**
- [ ] **SEO:**
  - Auto-generate sitemap.xml
  - Optimize robots.txt
  - Expand Schema.org markup (Person, Course, Event)
  - Add meta descriptions to all pages
- [ ] **Performance:**
  - Convert to Next.js `<Image>` component
  - Use WebP format for images
  - Implement lazy loading
  - Remove unnecessary animation delays (350ms home delay)
- [ ] **Lighthouse Audit:**
  - Target score: 90+ across all metrics
  - Optimize Core Web Vitals

---

#### 13. Admin Dashboard Improvements
**Status:** Basic functionality
**Impact:** LOW - Internal tool
**Effort:** MEDIUM (2 days)

**Implementation:**
- [ ] WYSIWYG editor enhancements:
  - Image upload with preview
  - Table insertion
  - Code block support
- [ ] Preview before publish
- [ ] Content version history
- [ ] Analytics dashboard (page views, popular content)

---

### 🔵 **P3 - LOW PRIORITY** (Future / Nice-to-Have)

#### 14. Join Us / Recruitment Page ✅ COMPLETED (Alternative Solution)
**Status:** ✅ Implemented via shared component
**Impact:** LOW - Can be handled via email
**Decision:** Email-based approach chosen (standard for academic labs)

**✅ Implemented:**
- [x] **JoinUs Component** on all pages:
  - "Join Our Team" heading
  - Recruitment message
  - Open Positions info (PhD, MS, Undergrad, Postdoc)
  - Email contact link (haebeomlee@korea.ac.kr)
- [x] Consistent placement at bottom of:
  - About Us (after Research Areas)
  - People (replaced inline section)
  - Publications (replaced custom section)
  - Courses (after Academic Information)
  - Gallery (standalone)

**Decision Rationale:**
- Academic labs typically use email-based communication
- Maintains flexibility for personalized discussions
- No complex application system needed
- Follows industry standard (Stanford AI Lab, MIT CSAIL, etc.)

---

#### 15. Resources Page
**Status:** Missing
**Impact:** LOW - Community contribution
**Effort:** HIGH (3+ days)

**Implementation:**
- [ ] Public datasets
- [ ] Open-source code repositories
- [ ] Tutorials and blog posts
- [ ] Educational materials

---

#### 16. Contact Page
**Status:** Missing
**Impact:** LOW - Can use email
**Effort:** LOW (0.5 day)

**Implementation:**
- [ ] Lab location map (Google Maps embed)
- [ ] Building/room directions
- [ ] Contact information
- [ ] Contact form (optional)

---

#### 17. Interactive Visualizations
**Status:** Missing
**Impact:** LOW - Visual appeal
**Effort:** HIGH (3+ days)

**Implementation:**
- [ ] Research topic relationship graph (D3.js)
- [ ] Publication timeline visualization
- [ ] Collaboration network map
- [ ] Live counters (visitors, citations)

---

#### 18. Accessibility Improvements
**Status:** Basic compliance
**Impact:** MEDIUM - Inclusive design
**Effort:** MEDIUM (2 days)

**Implementation:**
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader testing
- [ ] Keyboard navigation
- [ ] ARIA labels for all interactive elements
- [ ] Color contrast validation

---

## 🎨 Design System (Current - Keep This)

### Color Palette
```css
/* Primary - Professional Academic */
--color-text-dark: #222;          /* Headings */
--color-text-medium: #444;        /* Body text */
--color-text-light: #666;         /* Secondary text */

/* Background */
--color-bg-white: #fff;
--color-bg-light: #f9fafb;
--color-bg-highlight: #f5f5f5;

/* Accent - Minimal use */
--color-link-blue: #3b82f6;
--color-link-hover: #2563eb;

/* Neutral Grays */
--color-gray-50: #F8FAFC;
--color-gray-100: #F1F5F9;
--color-gray-200: #E2E8F0;
--color-gray-300: #CBD5E1;
--color-gray-400: #94A3B8;
--color-gray-500: #64748B;
--color-gray-600: #475569;
--color-gray-700: #334155;
--color-gray-800: #1E293B;
--color-gray-900: #0F172A;
```

### Typography Standards
```css
/* Headings - Georgia Serif */
h1: Georgia, max(2rem, min(4vw, 2.5rem)), weight 300
h2: Georgia, max(1.25rem, min(3vw, 1.5rem)), weight 700
h3: Georgia, max(1.1rem, min(2.5vw, 1.25rem)), weight 700

/* Body - Lato Sans-serif */
body: Lato, 13pt, weight 300, line-height 1.6
p: Lato, max(0.9rem, min(2vw, 1rem))

/* UI Elements - System fonts */
buttons, nav: -apple-system, BlinkMacSystemFont, 'Segoe UI'
```

### Spacing System
```css
--spacing-xs: 0.25rem  /* 4px */
--spacing-sm: 0.5rem   /* 8px */
--spacing-md: 1rem     /* 16px */
--spacing-lg: 2rem     /* 32px */
--spacing-xl: 4rem     /* 64px */
--spacing-2xl: 6rem    /* 96px */
```

---

## 📊 Success Metrics (KPIs)

### User Experience
- **Bounce Rate:** < 40%
- **Avg. Session Duration:** > 2 minutes
- **Pages per Session:** > 3

### Performance
- **Lighthouse Performance:** > 90
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Engagement
- **Monthly Visitors:** 500+ (target)
- **Student Inquiries:** Track increase
- **Publication Downloads:** Track clicks

### SEO
- **Google "System 2 ML Lab":** Rank #1
- **Google "Korea University AI Lab":** Top 5
- **Domain Authority:** Monitor growth

---

## 📋 Implementation Workflow

### Week 1-2 (P0 Critical)
1. Research page implementation
2. Homepage hero CTA buttons
3. Publications filtering system
4. Professor profile enhancement

### Week 3-4 (P1 High)
5. News page implementation
6. Lab statistics section
7. People page enhancement
8. Lab timeline

### Week 5-6 (P2 Medium)
9. Gallery storytelling
10. Courses expansion
11. SEO & performance optimization
12. Admin dashboard improvements

### Future (P3 Low)
13. Join Us page
14. Resources page
15. Contact page
16. Interactive visualizations
17. Accessibility audit

---

## 🔗 Competitive Analysis References

### Berkeley AI Research (BAIR)
- **URL:** https://bair.berkeley.edu/
- **Strengths:** Minimalist design, strong brand identity, Berkeley colors
- **Lessons:** Clear positioning, simple navigation, professional credibility

### KIXLAB (KAIST)
- **URL:** https://www.kixlab.org/
- **Strengths:** Research theme cards, publication counts, group photo
- **Lessons:** Visual engagement, categorized research, community feeling

### Stanford HAI
- **URL:** https://hai.stanford.edu/
- **Strengths:** Comprehensive navigation, multidisciplinary focus, policy/education sections
- **Lessons:** Clear mission, extensive content organization, newsletter integration

### Prof. Hae Beom Lee's Site
- **URL:** https://haebeom-lee.github.io/
- **Strengths:** Publication-focused, clear research interests, student guidance
- **Lessons:** Academic credibility signals, direct paper links, structured layout

---

## 📝 Notes

- **Design Philosophy:** Keep current academic, clean aesthetic
- **Color Palette:** Current palette is excellent - professional and scholarly
- **Typography:** Georgia + Lato combination works well
- **Priority Focus:** Content over decoration
- **Mobile-First:** Ensure all improvements are responsive

---

## 🚀 Quick Wins (Can Implement Today)

1. ~~**Publications "Total Count" Header**~~ ✅ COMPLETED
2. ~~**Publications Filtering System**~~ ✅ COMPLETED
3. ~~**Homepage CTA Buttons**~~ ✅ DECIDED AGAINST (keeping clean design)
4. ~~**Lab Statistics Section**~~ ✅ DECIDED AGAINST (avoiding clutter)
5. **Professor Photo in About Us** (15 mins - need image)
6. ~~**Research Page Hero Text**~~ ❌ N/A (Research page removed)

## 📋 Session Summary (2025-10-05)

### ✅ Completed Today:
1. **Footer Unification** - Created shared Footer component, applied to all pages
2. **Typography Standardization** - Implemented CSS variables for consistent font sizing
3. **Publications Filtering** - Year, Venue, Topic dropdowns + search functionality
4. **Publications UI Redesign** - Compact menu bar filters (dropdown style)
5. **Join Us Sections** - Created shared JoinUs component, applied to all pages
6. **Page Layout Consistency** - Ensured all pages use 900px max-width, left-aligned

### 🎯 Remaining Priority Tasks:

#### High Priority (1-3 days):
1. **About Us - Professor Profile Enhancement** ⭐⭐⭐
   - Add professional headshot of Prof. Lee
   - Highlight key achievements/collaborations
   - Improve visual hierarchy
   - **Effort:** 1 day (15 mins if photo available)

2. **People Page Enhancement** ⭐⭐
   - Larger profile photos
   - Research interests tags
   - Personal website/GitHub/Scholar links
   - **Effort:** 1-2 days

3. **Gallery Storytelling Enhancement** ⭐
   - Add event names and dates
   - Better categorization
   - Image captions with context
   - **Effort:** 1 day

#### Medium Priority:
4. **SEO & Performance Optimization** ⭐⭐
   - Convert to Next.js Image component
   - Optimize images (WebP)
   - Schema.org markup expansion
   - **Effort:** 2 days

5. **Admin Dashboard Improvements** ⭐
   - WYSIWYG editor enhancements
   - Preview before publish
   - Content version history
   - **Effort:** 2 days

### ❌ Explicitly Rejected Tasks:
- ~~Homepage CTA Buttons~~ - Decided to keep clean design
- ~~Lab Statistics Section~~ - Would clutter About Us page
- ~~Research Page~~ - Removed, content in About Us
- ~~News Page~~ - Removed, content in Homepage carousel

---

**Document Version:** 1.0
**Next Review:** After Week 2 (P0 completion)
**Owner:** Development Team
**Stakeholder:** Prof. Hae Beom Lee
