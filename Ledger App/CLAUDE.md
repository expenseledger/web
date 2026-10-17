# Ledger App Wiki — Schema

This Obsidian vault is an LLM-maintained wiki about the `expense-ledger-web`
repo (the parent directory). The LLM writes and maintains every page; the
human curates sources, asks questions, and browses in Obsidian.

## Layers

- **Raw sources** (read-only, never edit):
  - The codebase itself (`../src`, `../schema.graphql`, configs, git log).
  - `raw/` — non-code sources the human drops in (tickets, notes, specs,
    clipped articles). Images go in `raw/assets/`.
  - **Backend agent** — backend code is not in `raw/`. Ask the Claude
    session in charge of it (currently `ledger-api-v3-bb`) via
    SendMessage. Cite answers as "backend agent, YYYY-MM-DD" plus the
    backend file paths it gives.
  - **API v2 backend** — `gitlab.com/forestware/expense-ledger/
    expense-ledger-api`. Read with `glab repo clone` into a scratch dir.

## API versions

The app currently runs against **API v2** (Postgraphile). **API v3** is a
new backend codebase the app will eventually migrate to. Always label
backend facts as v2 or v3; never merge them on one page without saying
which is which. v3 knowledge lives on `API v3 *` pages; migration
planning on [[API v3 Migration]].
- **Wiki** (`wiki/`) — LLM-owned markdown pages. Flat directory; categories
  live in frontmatter and in `wiki/index.md`, not in folders.
- **Schema** — this file. Update it when conventions change.

## Page conventions

- File name = page title, Title Case (e.g. `Transaction.md`).
- Link with `[[Page Name]]`. Link liberally; a red link marks a page worth
  writing later.
- Cite code as `` `src/path/file.ts` `` (repo-relative). Cite `raw/` sources
  with `[[raw/file]]`.
- Frontmatter on every wiki page:

  ```yaml
  ---
  type: entity | concept | screen | ops | synthesis | meta
  tags: [ ... ]
  sources: [src/..., raw/...]
  updated: YYYY-MM-DD
  ---
  ```

- Prefer short sections and bullets. State facts found in code; mark
  inferences with "(inferred)" and unknowns in [[Open Questions]].
- Bugs/smells go in [[Known Issues]] with a file reference; link to them
  from the relevant page instead of duplicating.
- Contradictions: when new evidence contradicts a page, fix the page and
  note the change in `log.md`. Don't leave both claims standing.

## Special files

- `wiki/index.md` — catalog of every page, grouped by `type`, one line each.
  Read it first when answering a question. Update on every change.
- `wiki/log.md` — append-only. Each entry header:
  `## [YYYY-MM-DD] <ingest|query|lint|update> | <title>`
  so `grep "^## \[" wiki/log.md | tail -5` shows recent activity.

## Workflows

**Ingest** (new source in `raw/`, or code changed — e.g. after a merge):

1. Read the source (for code: `git log`/`git diff` since the last
   `ingest` entry in `log.md`).
2. Briefly tell the human the key takeaways.
3. Create/update every affected page; add new pages to `index.md`.
4. Resolve or add items in [[Known Issues]] / [[Open Questions]].
5. Append a `log.md` entry listing pages touched.

**Query**: read `index.md` → relevant pages → verify against code if the
answer matters → answer with `[[links]]` and file refs. If the answer is
reusable (comparison, analysis, how-to), file it as a `synthesis` page.

**Lint** (on request): check for contradictions with current code, stale
claims, orphan pages, missing pages for often-mentioned concepts, missing
cross-links, and outdated frontmatter `updated` dates. Report, fix, log.
