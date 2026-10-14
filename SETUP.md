# Going live on Hostinger: checklist

1. Upload: in Hostinger File Manager open `public_html`, upload `clinivo-hostinger-upload.zip`, extract it there, delete the zip. You should see index.html, privacy.html, terms.html, 404.html, contact.php, robots.txt, sitemap.xml, site.webmanifest, favicon.ico, .htaccess and the assets folder.
2. SSL: Websites → Dashboard → Security → SSL → Install SSL. The .htaccess already forces https://clinivomedia.in.
3. Email for the form: Emails → create the mailbox `website@clinivomedia.in` (it is the sender address in contact.php). Send a test enquiry from the live site and check clinivomedia@gmail.com, including the spam folder.
4. Analytics: create a Google Analytics 4 property for clinivomedia.in, copy the Measurement ID (G-XXXXXXX) into `assets/consent.js` (the GA_ID line), upload that file again. In GA: Admin → Data retention → set to 14 months (the Privacy Policy says 14).
5. Google Search Console: add clinivomedia.in, verify (DNS record in Hostinger), then submit https://clinivomedia.in/sitemap.xml.
6. Check: open https://clinivomedia.in in an incognito window, try the menu, the health check and the form; visit https://clinivomedia.in/anything to see the 404 page; paste the URL into WhatsApp to see the preview image.

## On your computer: design skills and the 21st.dev MCP (for Claude Code)

1. Skills: in this folder run `bash install-design-skills.sh` (installs Impeccable, Taste Skill, UI UX Pro Max and the DESIGN.md library), then restart Claude Code.
   UI UX Pro Max also installs as a plugin inside Claude Code:
   `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` then `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`
2. 21st.dev Magic MCP: create a fresh API key at 21st.dev, then in a terminal run:
   `claude mcp add --transport http 21st https://21st.dev/api/mcp --header "x-api-key: YOUR_NEW_KEY"`
   Check it with `claude mcp list`. Keep the key out of chats, files and git.
