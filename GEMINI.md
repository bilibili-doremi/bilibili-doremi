# Gemini Settings

- Do not automatically commit to git.

## Project Overview

This is a browser extension for Bilibili videos by the user "FA将军". It displays the current musical scale (do, re, mi...) on a piano keyboard overlayed on the video.

## Key Files

- `manifest.json`: The extension's manifest file.
- `content.js`: The main content script that handles the logic for displaying the scale information.
- `scales.json`: The data file containing the musical scale information for different videos. The key is the Bilibili video ID (BV ID), and the value is an array of objects with `time`, `tonic`, and `mode`.
- `settings.html`, `settings.js`, `settings.css`: Files for the extension's settings page.
- `icon.svg`: The source file for the extension's icons.

## Development Commands

- `npm run lint`: Lints the JavaScript files.
- `npm run format`: Formats the code using Prettier.
- `npm run package`: Packages the extension into a zip file using `web-ext`. The output is in the `web-ext-artifacts` directory.

## Icon Generation

The PNG icons (`icon16.png`, `icon48.png`, `icon128.png`) are generated from `icon.svg` using Inkscape.

To regenerate the icons, run the following commands:

```bash
inkscape --export-type="png" --export-width=16 --export-height=16 --export-filename="icon16.png" "icon.svg"
inkscape --export-type="png" --export-width=48 --export-height=48 --export-filename="icon48.png" "icon.svg"
inkscape --export-type="png" --export-width=128 --export-height=128 --export-filename="icon128.png" "icon.svg"
```
