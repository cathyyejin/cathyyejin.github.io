# 모바일 청첩장 React + Vite + Tailwind

A lightweight React app built with **Vite** and styled with **Tailwind CSS**.  
This repository is the user site **cathyyejin.github.io**, so GitHub Pages serves from the default branch.

## Version

Current version: **1.0.0**

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history and changes.

## Tech Stack
- Vite
- React
- Tailwind CSS (v4)
- GitHub Pages (deployment)

## Requirements
- Node.js 18+ (20+ recommended)
- npm (or yarn/pnpm)
- Git (SSH set up for the **cathyyejin** account)

## Getting Started

```bash
# clone (SSH using your host alias)
git clone git@github-cathyyejin:cathyyejin/cathyyejin.github.io.git
cd cathyyejin.github.io

# install deps
npm install

# start dev server
npm run dev

# production build
npm run build

# preview the production build
npm run preview

.
├─ index.html
├─ package.json
├─ vite.config.(js|ts)
├─ public/            # static assets (e.g., /favicon.ico)
└─ src/
   ├─ main.(jsx|tsx)  # app entry
   ├─ App.(jsx|tsx)
   ├─ index.css       # @tailwind base/components/utilities
   └─ components/*