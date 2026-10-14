#!/usr/bin/env bash
# Installs the design skills used for this site into Claude Code (user-wide),
# and clones the DESIGN.md inspiration library into this project.
# Run from inside the clinivo-site folder:  bash install-design-skills.sh
set -e
SKILLS="$HOME/.claude/skills"
TMP="$(mktemp -d)"
mkdir -p "$SKILLS"

echo "1/4 Impeccable (pbakaus/impeccable)"
git clone --depth 1 https://github.com/pbakaus/impeccable "$TMP/impeccable"
rm -rf "$SKILLS/impeccable" && cp -r "$TMP/impeccable/plugin/skills/impeccable" "$SKILLS/impeccable"

echo "2/4 Taste Skill (Leonxlnx/taste-skill)"
git clone --depth 1 https://github.com/Leonxlnx/taste-skill "$TMP/taste"
for s in taste-skill soft-skill minimalist-skill redesign-skill output-skill stitch-skill; do
  rm -rf "$SKILLS/$s" && cp -r "$TMP/taste/skills/$s" "$SKILLS/$s"
done

echo "3/4 UI UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill)"
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill "$TMP/uupm"
rm -rf "$SKILLS/ui-ux-pro-max" && cp -r "$TMP/uupm/.claude/skills/ui-ux-pro-max" "$SKILLS/ui-ux-pro-max"
rm -rf "$SKILLS/ui-ux-pro-max/scripts/tests"
sed -i.bak "s#\${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max#$SKILLS/ui-ux-pro-max#g" "$SKILLS/ui-ux-pro-max/SKILL.md" && rm -f "$SKILLS/ui-ux-pro-max/SKILL.md.bak"

echo "4/4 awesome-design-md (VoltAgent) -> ./.design-md"
[ -d .design-md ] || git clone --depth 1 https://github.com/VoltAgent/awesome-design-md .design-md

rm -rf "$TMP"
echo "Done. Restart Claude Code, open this folder, and try: /impeccable critique index.html"
