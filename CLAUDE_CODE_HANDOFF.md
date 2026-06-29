# Claude Code Handoff Prompt

Paste this entire message into Claude Code to get started:

---

I have a React interactive data visualisation I want to scaffold into a proper Vite project, push to GitHub, and deploy to GitHub Pages.

## The file

`token_paradox.jsx` is in this directory. It's a self-contained React component (no external dependencies beyond React itself) — an interactive explorer of the "token cost paradox" in AI: two sliders control annual price decline and usage growth rates, and three small-multiple canvas charts update in real time showing token volume, price per token, and total spend over 5 years.

## What I need you to do

1. Scaffold a Vite + React project in this directory (use `npm create vite@latest . -- --template react`)
2. Replace the generated `src/App.jsx` with the contents of `token_paradox.jsx`
3. Clean up the default Vite boilerplate (remove `App.css`, `index.css` import if unused, clear `public/vite.svg`, etc.)
4. Verify it builds cleanly with `npm run build`
5. Create a new public GitHub repo: `acotgreave/token-paradox-explorer`
   - Use `gh repo create acotgreave/token-paradox-explorer --public --description "Interactive explorer of the AI token cost vs usage paradox"`
6. Commit everything and push to `main`
7. Set up GitHub Pages deployment via `gh-pages`:
   - `npm install --save-dev gh-pages`
   - Add `homepage` and `deploy` scripts to `package.json`
   - Run `npm run deploy`

## Repo details
- GitHub username: acotgreave
- Repo name: token-paradox-explorer
- Visibility: public
- Target URL after deploy: https://acotgreave.github.io/token-paradox-explorer

## Notes
- `gh` CLI is already authenticated on this machine
- Node/npm are already installed
- Keep commits clean — one for the initial scaffold, one for the gh-pages config

