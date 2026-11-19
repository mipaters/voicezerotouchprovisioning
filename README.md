# Spectrum Business Voice: Zero-Call Onboarding (demo)

Presenter-ready, fully scripted web demo: a small-business customer orders Spectrum Business Voice over
WhatsApp while AI agents provision it behind the scenes. No backend; everything is simulated from
`src/data/scenario.json`. All data is fictional (555 numbers, illustrative demo pricing).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Controls

| Key | Action |
| --- | --- |
| Space | Play / pause |
| → | Step one event |
| R | Reset |
| L | Toggle "Show Legacy Process" |
| N | Toggle presenter notes |

The top bar also has speed (1x/2x/4x). The end-of-demo summary opens when the run finishes
(close it with the X, reopen via "Show summary").

## Editing the story

Edit `src/data/scenario.json`, no code changes needed:

- `events[]`: ordered timeline. `type` is `chat | agent | log | checklist | callout | kpi`.
  Chat events can carry a `widget` (location, photo, loa, list, secureLink, summary) and quick `replies`;
  a customer message's `selects` highlights the matching reply/list item, and `resolves` marks a LOA/payment card complete.
- `steps[]`, `lanes[]`, `agents{}`: the swimlane board, including the "Today:" pain point per step.
- `phases[]`: presenter notes shown in the Notes panel.
- `meta.timeScale` scales scenario seconds into the "customer time" counter.

## Optional Live AI

Off by default. If these are set at build time, a "Live AI" toggle appears and the sales agent's replies are
rephrased by Azure OpenAI (same facts, scripted fallback on any error or after 6 s). See `.env.example`.
Note: Vite variables are embedded in the client bundle, so use this only for local/private demos, never with a production key.

## Deploy to Azure Static Web Apps

- App location: `/` · Output location: `dist` · Build command: `npm run build`
- `public/staticwebapp.config.json` (SPA fallback, security headers) is copied to `dist/` automatically.

```bash
npm run build
npx @azure/static-web-apps-cli deploy ./dist --deployment-token <TOKEN>
```

Benchmarks on the legacy view are labelled "Workshop estimates" and are not measured data.
