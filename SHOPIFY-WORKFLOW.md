Shopify VS Code Workflow (rebe_lite)

Prerequisites
- Shopify CLI installed
- Logged in: shopify auth login --store rebeyou.myshopify.com

Project root
- Run commands from this folder: rebe_lite

Main commands
- Pull full theme from Admin:
  shopify theme pull

- Push all local changes to selected Admin theme:
  shopify theme push

- Push one file only:
  shopify theme push --only assets/theme.js

- Pull one file only:
  shopify theme pull --only assets/theme.js

Useful targeting options
- Push to a specific theme id:
  shopify theme push --theme 193513193638

- Pull from a specific theme id:
  shopify theme pull --theme 193513193638

- Open theme editor preview:
  shopify theme open

Recommended daily flow
1. shopify theme pull
2. Make edits in VS Code
3. shopify theme push --only <path> for quick updates during work
4. shopify theme push for a full sync when done

Safety tips
- Keep active edits in rebe_lite only.
- Confirm target theme id before any full push.
- Pull first to avoid overwriting newer Admin-side changes.
