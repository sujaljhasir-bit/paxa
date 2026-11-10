# PromptLens — Fastify + Vercel

PromptLens compares prompting habits across ChatGPT, Claude.ai, Claude Code, and Gemini. It includes consent, multiple-file import, sample data, aggregate charts, prompting styles, export previews, JSON/HTML downloads, and deletion.

## Run locally

Install Node.js 22, then open a terminal in this folder:

    npm ci
    npm start

Open http://localhost:3000. Run `npm test` for the server checks. `npm run dev` restarts the server when its files change.

## Deploy from GitHub to Vercel

1. Extract the ZIP on your computer. Open the `promptlens-fastify` folder.
2. Create an empty GitHub repository. Upload the CONTENTS of this folder, including the `api`, `web`, and `test` folders. Commit the files. `package.json` and `vercel.json` must be at the repository root. Do not upload just the ZIP: GitHub does not extract it.
3. On Vercel, select Add New → Project, connect GitHub, and import that repository.
4. Select Framework Preset **Other**. Leave Root Directory at the repository root. Use Node.js **22.x**. Leave Build Command disabled/empty and Output Directory unset; the included configuration handles routing. The default npm install command is sufficient.
5. Click Deploy. Open the deployment URL, check the consent box, load sample data, and click Analyze.

No environment variables, API keys, database, or paid AI account are required. Later GitHub commits trigger deployments automatically. The package has been tested locally; it has not been deployed to your Vercel account.

If you put the entire `promptlens-fastify` folder inside your repository instead, set Vercel's Root Directory to that folder.

## What to import into the app

Unzip exports first. Use ChatGPT's or Claude.ai's `conversations.json`, Claude Code session `.jsonl` files, or Gemini Google Takeout `MyActivity.json`. You can select multiple files or a folder where supported. Never commit personal exports to GitHub.

## Structure

- `web/index.html`: complete app, with inline CSS and JavaScript.
- `app.js`: Fastify app factory, serving the HTML.
- `server.js`: local server entry point.
- `api/index.js`: Vercel serverless handler; it does not open a listening port.
- `vercel.json`: routes requests to Fastify and includes the HTML in the function bundle.
- `test/server.test.js`: server and handler checks.

## Privacy

Fastify delivers the page only. Selected files, raw prompts, and analysis are never sent to Fastify or an AI provider. There are no upload endpoints. Analysis remains entirely in browser memory with no cookies or localStorage; CSP blocks browser connections from the app. Vercel receives ordinary page requests and may keep hosting access logs, but no selected file contents. Do not enable Vercel Analytics or inject external scripts if you want to preserve this design.

Reports contain aggregates only, not filenames, prompts, or conversation IDs. Downloads show exact-content previews. Delete all data aborts reads and releases app references; browser garbage collection controls memory reclamation, and original files/downloads are unchanged.

## Adding a parser

In `web/index.html`, find the PARSERS section. Add a function returning `null` for unrecognized input or records shaped `{source, timestamp, text, conversationId}` for user prompts. Register it in `PARSERS` and its label at the matching position in `SOURCES`. Use the normalization helpers and skip malformed entries.

## Limitations

Export schemas can change. Duplicate/overlapping exports count again; ChatGPT branches are included. Gemini activities without conversation IDs count as separate proxy conversations. Invalid dates are excluded from activity; timezone is browser-local. Words use whitespace splitting, correction cues are English heuristics, and styles are illustrative. Large files may exceed browser memory. Folder support depends on the browser. The server is only a delivery layer and adds no cloud analysis.

## Fix for Vercel `unused_function`

This package uses an explicit `@vercel/node` build for `api/index.js`, instead of relying on function auto-discovery. Replace your previous `vercel.json` with this version; do not merge its `builds`/`routes` settings with old `functions`/`rewrites` settings. Explicit builds control the deployment, so Vercel may show a notice that dashboard build settings do not apply.

Before deploying, confirm this layout in the Vercel Root Directory:

    package.json
    package-lock.json
    vercel.json
    app.js
    api/
      index.js
    web/
      index.html

If your repository contains a parent `promptlens-fastify` folder, choose that folder as Vercel's Root Directory. If the files above are at the repository root, leave Root Directory at the root. GitHub web uploads must include the actual folders and files, not just the ZIP. Do not upload `.git` or `node_modules`.

Commit the replacement configuration, then redeploy the latest commit. The explicit configuration and archive contents were checked locally, but a successful hosted deployment still needs to be verified in your Vercel account.
