---
type: synthesis
tags: [api, versioning]
sources: [human 2026-10-21, docs.github.com, docs.gitlab.com, shopify.dev]
updated: 2026-10-22
---

# API Path Conventions

How public APIs put more than one protocol on one host, and where the
version goes. Background for the `/api/graphql` decision ([[API v3]]).

## Examples (checked 2026-10-21)

| API | GraphQL | REST | Version scope |
|---|---|---|---|
| GitHub | `api.github.com/graphql` | `api.github.com/...` + `X-GitHub-Api-Version` header | REST only; GraphQL unversioned |
| GitLab | `/api/graphql` | `/api/v4/...` | REST only; GraphQL "versionless" |
| Shopify | `/admin/api/2026-10/graphql.json` | `/admin/api/2026-10/<resource>.json` | Shared date version, both protocols |
| Yelp | `api.yelp.com/v3/graphql` | `api.yelp.com/v3/...` | Shared `v3` (secondhand sources) |

## Patterns

- **Each protocol versioned on its own** (GitHub, GitLab): the version
  belongs to one protocol, and GraphQL is usually unversioned
  (deprecate fields instead). This is the most common pattern.
- **One version for the whole product** (Shopify, Yelp): the version
  covers every protocol, so `/v3/graphql` next to `/v3/<rest>` is
  consistent. It works only when both are released together.

## Ledger

The endpoint is `/api/graphql`, with no version (human, 2026-10-22):
the first pattern, like GitLab. Retire fields with `@deprecated` and a
removal date in the reason. A future REST API would get a sibling path
with its own version, e.g. `/api/rest/v1` (inferred; nothing planned).
On 2026-10-21 the choice was `/api/v3` with no `/graphql` suffix.
