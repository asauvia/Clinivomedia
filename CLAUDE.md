# Clinivo Media website

Read PRODUCT.md (who and what) and DESIGN.md (how it looks) before any UI work.

## Always, when generating or changing a website
1. Run the `ui-ux-pro-max` skill first: `--design-system` for a new site or page, `--domain ux` checks before delivery, and its pre-delivery checklist at the end.
2. Then `impeccable` (direction, craft floor, detector) and `taste-skill` (anti-generic rules).
3. Conflicts: the brief, PRODUCT.md and DESIGN.md win over any skill's suggested style, palette or section list. Never add testimonials, stats or logos that aren't real.
4. For ready-made React/Tailwind components, use the 21st.dev Magic MCP if it is connected (see SETUP.md), restyled to DESIGN.md.

- Use the `impeccable` skill for design work (`/impeccable critique`, `/impeccable polish`, `/impeccable audit`).
- Use `taste-skill` for new sections; it bans the generic AI-landing defaults.
- For inspiration only, browse `.design-md/design-md/<site>/DESIGN.md` (70+ real sites). Borrow discipline, never a brand's look.
- Content rules: only facts from the Clinivo deck/proposal. No invented clients, testimonials, numbers or prices. No guaranteed medical results.
- Contact: Deeptanshu, +91 70523 01258, clinivomedia@gmail.com, @clinivomedia.

## Files
- Edit source files here, then run `python3 build.py` to produce `deploy/` (upload its contents to Hostinger public_html).
- index.html is written without <!doctype>/<head> wrappers (it is also published as a Claude artifact); build.py adds them.
- assets/base.css and assets/consent.js are shared by every page. GA4 ID goes in assets/consent.js.
- contact.php handles the consultation form (server validation, honeypot, timing, origin check, rate limit).
