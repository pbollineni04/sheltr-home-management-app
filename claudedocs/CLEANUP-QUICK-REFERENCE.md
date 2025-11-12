# Quick Cleanup Reference

## What to Delete (Right Now - 100% Safe)

### Favicon Exploration Files
```bash
rm /public/favicon-option1.svg
rm /public/favicon-option2.svg
rm /public/favicon-option2-revised.svg
rm /public/favicon-option3.svg
rm /public/favicon-option4.svg
rm /public/favicon-v2a.svg
rm /public/favicon-v2b.svg
rm /public/favicon-v2c.svg
rm /public/favicon-v2d.svg
rm /public/FAVICON_OPTIONS.md
```

**Why**: Development exploration files. Current favicon is `/favicon.ico`. No code references SVG variants.
**Risk**: ZERO

---

## What to Consider Deleting

### Unused UI Components (Only if not planned)
```bash
# If you don't plan to use these soon, delete them:
rm /src/components/ui/breadcrumb.tsx
rm /src/components/ui/calendar.tsx
rm /src/components/ui/carousel.tsx
rm /src/components/ui/command.tsx
rm /src/components/ui/drawer.tsx
rm /src/components/ui/pagination.tsx
rm /src/components/ui/sidebar.tsx
```

**Why**: Not imported anywhere in the codebase
**Risk**: ZERO (can be re-added from shadcn/ui if needed)
**Decision**: Delete if not on your roadmap, keep if planned for future

---

### Duplicate Documentation
```bash
# Keep one, delete/move the other:
# Option A: Keep LANDING-PAGE-SPEC.md in claudedocs (more detailed)
rm /LANDING-PAGE-SUMMARY.md

# Option B: Keep quick reference, clarify that spec is in claudedocs
# (Keep LANDING-PAGE-SUMMARY.md, note LANDING-PAGE-SPEC.md is canonical)
```

**Why**: LANDING-PAGE-SUMMARY.md is redundant with LANDING-PAGE-SPEC.md
**Risk**: ZERO

---

### Move to Archive (Optional)
```bash
# If you want to preserve history for reference:
mkdir -p /claudedocs/archive

# Move old documentation:
mv /Project\ Instructions.txt /claudedocs/archive/
mv /LANDING-SCREENSHOTS.md /claudedocs/archive/
```

**Why**: Not referenced by current development process
**Risk**: ZERO

---

## What NOT to Delete (Keep These)

- All `/src` code
- All landing page components (recently refactored)
- All actively used UI components
- `/claudedocs` documentation
- Task templates and bundles
- Timeline integration code

---

## Space Savings by Cleanup

| Action | Space | Time |
|--------|-------|------|
| Delete favicon files | 7.5 KB | 1 min |
| Delete unused UI components | 2.5 KB | 5 min |
| Delete/move docs | 9 KB | 2 min |
| Delete `/dist` (build artifacts) | 808 KB | 1 min |
| Delete `/test-results` | <1 KB | 1 min |
| **TOTAL** | **~828 KB** | **~10 min** |

---

## How to Execute Cleanup

### Step 1: Clean Favicon Files (Fastest)
```bash
cd /Users/pranav/sheltr-home-management-app
rm public/favicon-option*.svg public/favicon-v*.svg public/FAVICON_OPTIONS.md
```

### Step 2: Review UI Components
Ask yourself: "Will I use breadcrumb, calendar, carousel, command, drawer, pagination, or sidebar in the next 3 months?"
- YES → Keep them
- NO → Delete them

### Step 3: Consolidate Documentation
Decide: Keep LANDING-PAGE-SUMMARY.md or use only LANDING-PAGE-SPEC.md?

### Step 4: Commit Changes
```bash
git add -A
git commit -m "cleanup: remove unused favicon exploration files and outdated documentation"
```

---

## Risk Assessment: Very Low

- No code depends on deleted files
- All deletions are development artifacts or duplicates
- Git history allows recovery if needed
- No breaking changes
- No database or configuration affected

---

## Questions?

See the full analysis in `/claudedocs/CLEANUP-ANALYSIS.md`

