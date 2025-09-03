# Wavas Chrome Extension

Wavas is a Chrome extension that allows you to highlight, select, and batch download images from any website. It supports dynamic image detection, overlays, and a floating download button. Built with Manifest V3 and production-ready for Chrome Web Store submission.

## Features
- Highlights all images on hover with a green border
- Click to select/deselect images (shows checkmark overlay)
- Floating "Download Selected" button for batch downloads
- Uses chrome.downloads API for saving images
- Handles dynamically loaded images via MutationObserver
- Popup to enable/disable extension per site

## Installation
1. Clone or download this repository.
2. Go to `chrome://extensions` in Chrome.
3. Enable Developer Mode.
4. Click "Load unpacked" and select the extension folder.

## Usage
- Click the Wavas toolbar button to enable/disable on the current site.
- Hover over images to highlight, click to select.
- Use the floating button to download all selected images.

## Permissions
- `activeTab`, `downloads`, `storage`

## License
MIT
