# Gemini Settings

- Do not automatically commit to git.

---

# Icon Generation

The PNG icons (`icon16.png`, `icon48.png`, `icon128.png`) are generated from `icon.svg`.
To regenerate the PNGs, use the following Inkscape commands:

```bash
inkscape --export-type="png" --export-width=16 --export-height=16 --export-filename="icon16.png" "icon.svg"
inkscape --export-type="png" --export-width=48 --export-height=48 --export-filename="icon48.png" "icon.svg"
inkscape --export-type="png" --export-width=128 --export-height=128 --export-filename="icon128.png" "icon.svg"
```
