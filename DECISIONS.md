# Technical Decisions

Each entry records what was decided, what else was considered, and why. Decisions can be revisited —
if one turns out wrong, add a new entry superseding it rather than editing history.

---

## D1 — Stack: Axum, Tokio, Askama, SQLite, SQLx
**Date:** 2026-09-07 · **Status:** Accepted

Web server Axum, async runtime Tokio, templates Askama, database SQLite via SQLx, plain HTML/CSS,
minimal JavaScript, Monaco editor added later.

**Alternatives considered:**
- *Actix Web* instead of Axum — mature and fast, but its actor heritage makes the mental model
  heavier. Axum is built directly on `tower` and `hyper`, and its extractor system is an unusually
  good vehicle for learning traits and generics in a real setting.
- *Tera* instead of Askama — runtime templates, Jinja-like, familiar from Python. Rejected because
  it loses compile-time checking: a typo becomes a runtime 500 instead of a build failure. Askama
  keeps the Jinja-like syntax *and* checks templates at compile time.
- *Diesel* or *rusqlite* instead of SQLx — Diesel is a full ORM (heavy, hides SQL, its own DSL to
  learn); rusqlite is synchronous, which fights the async runtime. SQLx is async-native and keeps
  SQL visible, which matters given the goal of actually learning SQL.
- *PostgreSQL* instead of SQLite — deferred. SQLite has no server to run, which removes a whole
  class of setup friction during learning. SQLx makes a later migration to Postgres tractable.

**Tradeoff accepted:** SQLite's concurrency model differs meaningfully from Postgres (single-writer).
That difference is itself a Stage 8 lesson rather than a problem to avoid.

---

## D2 — Async and HTTP taught *before* Axum
**Date:** 2026-09-07 · **Status:** Accepted

Concurrency, async, and raw HTTP become Stage 4, ahead of Axum (Stage 5). The original plan placed
async in Stage 7, after the web application was already built.

**Why:** There is no synchronous Axum. The first line of an Axum app is `#[tokio::main] async fn
main()`, and every handler is an `async fn`. Under the original ordering, `async` and `.await` would
be typed as magic words that silence the compiler for three stages — precisely the cargo-culting the
learning goals rule out.

**Why this ordering also solves a second gap:** HTTP is new territory too. Stage 4 ends by writing
raw HTTP response bytes into a TCP socket by hand. Axum then arrives as a labour-saving device whose
work is already understood, rather than as a black box.

**Tradeoff accepted:** the first browser-visible result arrives later. Worth it.

---

## D3 — Foundations code lives in the project repo, not in scratch files
**Date:** 2026-09-07 · **Status:** Accepted

Stages 0–3 are written in a `foundations/` crate inside the same repository. The curriculum data
modeled in Stage 2 and the prerequisite logic built in Stage 3 become the actual curriculum the
application serves in Stage 5.

**Why:** practice code that graduates into the product is worth more than practice code that is
deleted, and it keeps a single git history of the whole learning arc.

---

## D4 — Single crate now; Cargo workspace introduced later, as a lesson
**Date:** 2026-09-07 · **Status:** Accepted

Start with one standalone crate (`foundations/`). Convert the repository to a Cargo workspace when
the second crate (the web app) is actually needed, in Stage 5.

**Alternative considered:** set up the workspace immediately. Rejected — a workspace introduces a
virtual manifest, member paths, and a shared `target/` directory, none of which mean anything before
a second crate exists. Introducing it at the moment of genuine need makes it a real lesson instead
of ceremony.

---

## D5 — SQLx runtime-checked queries first, compile-time macros later
**Date:** 2026-09-07 · **Status:** Accepted

Begin with `sqlx::query()` (checked at runtime), then deliberately switch to the `query!` macro
(checked at compile time against a real database) as its own lesson in Stage 6.

**Why:** `query!` is remarkable but adds real friction — it needs `DATABASE_URL` available at build
time and an offline cache for CI. Meeting that friction *after* understanding what it buys makes the
tradeoff legible instead of mysterious.

---

## D6 — No code execution until Stage 7; local-only when it arrives
**Date:** 2026-09-07 · **Status:** Accepted

Exercises through Stage 6 are predetermined with fixed tests. No submitted code is executed.

When execution is built in Stage 7: `std::process::Command` with a **fixed argument vector** (never
a shell string), a hard wall-clock timeout, resource limits, a scratch working directory, and no
network access. **Local-only.**

**Explicitly out of scope:** production-safe execution of untrusted code. That requires real
isolation (containers, gVisor/Firecracker, or a WASM sandbox), and treating the local MVP as
production-ready would be a serious security error. This is recorded so the shortcut is never
mistaken for a finished design.

---

## D7 — Server-rendered HTML first; Monaco only when exercises exist
**Date:** 2026-09-07 · **Status:** Accepted

Plain HTML and CSS with minimal JavaScript through Stage 6. Monaco arrives in Stage 7.

**Why:** Monaco is a large dependency that earns its place only once there is code to edit. Keeping
rendering on the server for as long as possible also keeps the learning focus on Rust.

---

## D8 — Askama crate identity to be verified before use
**Date:** 2026-09-07 · **Status:** Open — revisit at Stage 5.5

The Askama crate has a tangled rename/fork history (`askama` → `rinja` → back to `askama`). The
current crate name, maintained version, and API will be checked against the registry and docs at the
time of use rather than assumed from memory.

---

## D9 — Lessons are markdown files; the reader is generated from them
**Date:** 2026-09-07 · **Status:** Accepted

Lesson content lives in `lessons/*.md` with YAML front matter (`id`, `stage`, `title`,
`prerequisites`, `estimated_minutes`, `concepts`, `status`). `tools/build-reader.mjs` renders those
files plus the four tracking documents into a single self-contained `reader.html`, opened via
`file://`. The generated file is gitignored; the markdown is the only source of truth.

**Why markdown files rather than chat:** conversation is the right medium for *dialogue* — pasting
an error, getting a hint, answering a question. It is the wrong medium for *reference*, because it
scrolls away and cannot be searched. Splitting the two puts each where it works.

**Why this is not a detour:** the front matter fields are deliberately the fields the curriculum
needs. In Stage 2 they become the struct that models a lesson; in Stage 5 the Axum app parses
`lessons/` and serves this same content. The reader is a throwaway stand-in for the real thing —
same principle as D3.

**Deliberately absent from the reader:** progress tracking, exercise checking, prerequisite
unlocking, and code execution. Those are the application being built, and building them is the point
of the project. The reader stays inert.

**Alternatives considered:**
- *A published web artifact* — nicer to share, but content would live in two places and the local
  file works offline and is versioned alongside the lessons.
- *Rendering markdown client-side via `fetch`* — rejected: browsers block `fetch` on `file://`
  origins, so the reader would only work behind a web server.

**Tradeoff accepted:** a build step. `node tools/build-reader.mjs` after any lesson change.
