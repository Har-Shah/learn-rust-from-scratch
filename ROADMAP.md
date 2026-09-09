# Rust Learning Roadmap

**Started:** (fill in your first day)
**Goal:** Independently build, test, and maintain production-quality Rust applications.
**Vehicle project:** An interactive Rust learning web app (Axum + SQLite) — written by me, guided by Claude.

## Honest scope note

This roadmap does not teach "all of Rust." Nothing finite does. Its target is the point where the
remaining unknowns are ones I can resolve myself from the docs, the compiler, and experiment.

## Status legend

| Mark | Meaning |
|------|---------|
| ⬜ | Not started |
| ⬜ | In progress |
| ✅ | Complete |

Completed lessons are also tagged with **how**:

- `[solo]` — I wrote it myself
- `[hint]` — I wrote it, but needed hints
- `[given]` — I needed the full solution → **automatically adds a review exercise**

**A lesson is complete when I can explain the concept in my own words — not when it compiles.**

## Current position

- **Stage:** 0 — Environment and mental model
- **Lesson:** 0.1 — Toolchain, the compilation model, and reading a compiler error
- **Status:** ⬜ Not started

**Reading lessons:** open `reader.html` in a browser (`open reader.html`). Rebuild it after any
lesson change with `node tools/build-reader.mjs`. Source of truth is `lessons/*.md`.

## Dependency graph

```
Stage 0  Environment
   |
Stage 1  Foundations .......... bindings, types, functions, control flow, &str/String
   |
Stage 2  Core model ........... ownership -> borrowing -> lifetimes -> structs/enums -> Option/Result
   |                                    |
   |                                    +-- everything below depends on this
Stage 3  Reliable programs .... modules, errors, iterators, closures, traits, generics, tests
   |                                    |
   |                                    +-- traits are a hard prerequisite for async and Axum
Stage 4  Async & HTTP ......... threads -> channels -> Send/Sync -> futures -> Tokio -> TCP -> HTTP bytes
   |
Stage 5  Axum ................. routing, extractors, state, templates, forms, errors, tracing
   |
Stage 6  Persistence .......... data modeling -> SQL -> SQLite -> SQLx -> migrations -> transactions
   |
Stage 7  Interactive exercises  definitions, evaluation, hints, Monaco, sandboxed execution
   |
Stage 8  Production ........... auth, config, observability, security, performance, deployment
   |
Stage 9  Capstone
```

---

## Stage 0 — Environment and mental model

| # | Lesson | Status |
|---|--------|--------|
| 0.1 | Toolchain, the compilation model, and reading a compiler error | ⬜ |
| 0.2 | Crate anatomy, your tools, and your first commit | ⬜ |

## Stage 1 — Foundations

| # | Lesson | Status |
|---|--------|--------|
| 1.1 | Bindings and mutability: `let`, `let mut`, shadowing, `const` | ⬜ |
| 1.2 | Scalar types, integer overflow, and why Rust has so many integer types | ⬜ |
| 1.3 | Compound types: tuples and arrays | ⬜ |
| 1.4 | Functions, expressions vs statements, the tail expression | ⬜ |
| 1.5 | Control flow: `if` as an expression, `loop`/`while`/`for`, labeled breaks | ⬜ |
| 1.6 | `&str` vs `String` — the first real Rust surprise | ⬜ |
| 1.7 | `Vec<T>` basics | ⬜ |
| 1.8 | **Checkpoint:** a small CLI exercise | ⬜ |

## Stage 2 — Rust's core model

*The most important stage. Expect it to take longer than feels reasonable.*

| # | Lesson | Status |
|---|--------|--------|
| 2.1 | Stack and heap — a concrete mental model | ⬜ |
| 2.2 | Ownership and moves | ⬜ |
| 2.3 | `Copy` vs `Clone` | ⬜ |
| 2.4 | Borrowing: shared references `&T` | ⬜ |
| 2.5 | Mutable references and the aliasing-XOR-mutability rule | ⬜ |
| 2.6 | Slices | ⬜ |
| 2.7 | Lifetimes, part 1: why the compiler asks | ⬜ |
| 2.8 | Structs and `impl` blocks | ⬜ |
| 2.9 | Enums and exhaustive `match` | ⬜ |
| 2.10 | `Option<T>` — the null that isn't | ⬜ |
| 2.11 | `Result<T, E>` — errors as values | ⬜ |
| 2.12 | **Checkpoint / app milestone:** model the curriculum in memory | ⬜ |

## Stage 3 — Organizing reliable programs

| # | Lesson | Status |
|---|--------|--------|
| 3.1 | Modules, paths, and visibility | ⬜ |
| 3.2 | Error propagation with `?` | ⬜ |
| 3.3 | Custom error types and `From` | ⬜ |
| 3.4 | Collections: `HashMap`, `BTreeMap`, the entry API | ⬜ |
| 3.5 | Iterators and laziness | ⬜ |
| 3.6 | Closures and `Fn` / `FnMut` / `FnOnce` | ⬜ |
| 3.7 | Traits: defining shared behavior | ⬜ |
| 3.8 | Generics and trait bounds | ⬜ |
| 3.9 | Static vs dynamic dispatch: `impl Trait` vs `dyn Trait` | ⬜ |
| 3.10 | Unit tests, integration tests, doc tests | ⬜ |
| 3.11 | Documentation and `cargo doc` | ⬜ |
| 3.12 | **Checkpoint / app milestone:** prerequisite graph + lock/unlock state machine, fully tested | ⬜ |

## Stage 4 — Concurrency, async, and HTTP from the socket up

*Moved ahead of Axum deliberately — see DECISIONS.md, D2.*

| # | Lesson | Status |
|---|--------|--------|
| 4.1 | Threads and `spawn` | ⬜ |
| 4.2 | Channels | ⬜ |
| 4.3 | `Arc`, `Mutex`, and shared state | ⬜ |
| 4.4 | `Send` and `Sync` | ⬜ |
| 4.5 | Blocking vs non-blocking; what an event loop actually is | ⬜ |
| 4.6 | Rust futures are lazy (the key difference from Python coroutines) | ⬜ |
| 4.7 | `async` / `.await` and the Tokio runtime | ⬜ |
| 4.8 | A raw TCP echo server | ⬜ |
| 4.9 | Writing HTTP response bytes by hand | ⬜ |
| 4.10 | **Checkpoint:** a hand-rolled HTTP server serving one page | ⬜ |

## Stage 5 — First web application (Axum)

| # | Lesson | Status |
|---|--------|--------|
| 5.1 | HTTP semantics: methods, status codes, headers | ⬜ |
| 5.2 | Axum setup and routing | ⬜ |
| 5.3 | Handlers and extractors — traits in the wild | ⬜ |
| 5.4 | Shared application state | ⬜ |
| 5.5 | Server-rendered templates | ⬜ |
| 5.6 | Static files | ⬜ |
| 5.7 | Forms and validation | ⬜ |
| 5.8 | Error responses and `IntoResponse` | ⬜ |
| 5.9 | Logging and tracing | ⬜ |
| 5.10 | **App milestone:** lessons render in a browser | ⬜ |

## Stage 6 — Persistence and progress tracking

| # | Lesson | Status |
|---|--------|--------|
| 6.1 | Relational data modeling | ⬜ |
| 6.2 | The SQL I actually need | ⬜ |
| 6.3 | SQLite and connection pooling | ⬜ |
| 6.4 | SQLx runtime-checked queries | ⬜ |
| 6.5 | Migrations | ⬜ |
| 6.6 | Transactions | ⬜ |
| 6.7 | Compile-time checked queries (`query!`) | ⬜ |
| 6.8 | Repository / service boundaries | ⬜ |
| 6.9 | **App milestone:** progress and streaks persist; the dashboard | ⬜ |

## Stage 7 — Interactive exercises

| # | Lesson | Status |
|---|--------|--------|
| 7.1 | Exercise and test definitions | ⬜ |
| 7.2 | The evaluation pipeline | ⬜ |
| 7.3 | Capturing and displaying compiler output | ⬜ |
| 7.4 | Progressive hints | ⬜ |
| 7.5 | Monaco editor integration | ⬜ |
| 7.6 | The security problem with running submitted code | ⬜ |
| 7.7 | Isolation, timeouts, and resource limits | ⬜ |
| 7.8 | **App milestone:** the app can check my code | ⬜ |

## Stage 8 — Production concepts

| # | Lesson | Status |
|---|--------|--------|
| 8.1 | Authentication and sessions | ⬜ |
| 8.2 | Authorization | ⬜ |
| 8.3 | Async in depth: cancellation, backpressure | ⬜ |
| 8.4 | Configuration and secrets | ⬜ |
| 8.5 | Observability | ⬜ |
| 8.6 | Security review | ⬜ |
| 8.7 | Performance and profiling | ⬜ |
| 8.8 | Containers and deployment | ⬜ |
| 8.9 | Architectural tradeoffs retrospective | ⬜ |

## Stage 9 — Capstone

Requirements and acceptance tests provided; design and implementation are mine, with minimal
guidance. Reviewed as a professional code review.

**Candidate feature:** the spaced-review scheduling engine — it needs real algorithmic design,
touches persistence and the domain model, and cannot be copied from a tutorial.

---

## Application milestones

| Milestone | Unlocked by |
|-----------|-------------|
| Repo initialized, minimal program runs | Stage 0 |
| Curriculum modeled in memory | Stage 2 |
| Prerequisite + lock/unlock logic, fully tested | Stage 3 |
| Hand-rolled HTTP server | Stage 4 |
| Lessons render in a browser | Stage 5 |
| Progress persists; dashboard | Stage 6 |
| Exercises are checkable | Stage 7 |
| Deployable | Stage 8 |
| Capstone feature | Stage 9 |

## Weak areas / review queue

*Populated automatically when a lesson is tagged `[given]`, or when a concept is missed twice.*

| Concept | Why flagged | Review exercise | Status |
|---------|-------------|-----------------|--------|
| — | — | — | — |

## Completed lessons

*None yet.*
