# M66 Ventures — Website

One-page corporate landing site for **M66 Ventures, LLC**, a privately held venture group / holding company. Black-and-gold luxury aesthetic, built to act as a credibility hub for partners, banks and investors.

## Stack
Static **HTML / CSS / vanilla JS** — no build step.
- `index.html` — markup (nav + Portfolio Companies dropdown, hero, about, holdings grid, philosophy, contact, footer)
- `styles.css` — all styling + animations (Bodoni Moda + Jost, gold gradient system)
- `script.js` — nav scroll state, dropdown, mobile menu, scroll reveals, contact form
- `assets/` — logo

## Preview locally
```
python -m http.server 4720
```
Then open http://localhost:4720

## Portfolio companies
| Company | Status | Link |
|---|---|---|
| Aurelium Labs | live | https://aureliumlabs.ai |
| NextPage Studios | live | https://nextpage-studios.vercel.app |
| Hammer & Rose | coming soon | — |
| Meadows & Muse | coming soon | — |
| Livi Brands | coming soon | — |

## Contact form
Built **Supabase-ready**: set `SUPABASE_URL` + `SUPABASE_KEY` at the top of `script.js` and create a
`leads` table (columns: name, email, company, message, source) with anonymous-insert RLS.
Until those keys are set, the form gracefully falls back to `mailto:legal@m66ventures.com`.

## Deploy (TODO)
- Deploy to Vercel; connect **m66ventures.com**.
- Provision the Supabase `leads` backend and paste keys into `script.js`.
- Replace the Privacy / Terms placeholder alerts with real pages.

Built by Aurelium Labs.
