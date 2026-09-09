# Learn Rust from Scratch

A guided Rust curriculum that takes you from no Rust to building, testing, and maintaining
production-quality applications — by building an interactive Rust learning web app as you go.

**You write the code. Claude teaches, reviews, and refuses to do it for you.**

That refusal is the point, and it is enforced by `CLAUDE.md` in this repo. Open this folder in
Claude Code and it will ask you to attempt things before showing solutions, explain compiler errors
instead of replacing your code, and decline to mark a lesson complete just because it compiles.

## Setup

**1. Install Rust**

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Then open a **new terminal** (the installer edits your shell profile, and an already-open shell
won't pick it up) and check all four tools:

```bash
rustc --version && cargo --version && rustfmt --version && cargo clippy --version
```

**2. Open this folder in Claude Code** and say:

> Start me on Lesson 0.1.

That's it. Everything else is in the lessons.

## Reading the lessons

Lessons are markdown in `lessons/`. Readable as-is, but there's a nicer view:

```bash
node tools/build-reader.mjs
open reader.html
```

Rebuild after any change, or leave it watching:

```bash
node tools/build-reader.mjs --watch
```

Requires Node. If you don't have it, just read the markdown directly — nothing is lost.

## What's here

| File | Purpose |
|------|---------|
| `ROADMAP.md` | All 10 stages, ~80 lessons, dependency graph. **Your progress tracker.** |
| `LEARNING_LOG.md` | One entry per session. Record mistakes honestly — it drives spaced review. |
| `DECISIONS.md` | Why this stack, why this order. Read D2 if you wonder why async comes before Axum. |
| `GLOSSARY.md` | Rust terms in plain language. Seeded entries show the format; write the rest yourself. |
| `lessons/` | Lesson content. Only the first few are written — Claude writes the rest as you reach them. |

## Honest expectations

**Only the first few lessons exist as files.** The roadmap is complete; the content is written on
demand as you reach it. This is by design — lessons get adapted to what you actually struggle with.

**This will not teach you "all of Rust."** Nothing finite does. The goal is the point where the
remaining unknowns are ones you can resolve yourself from the docs, the compiler, and experiment.

**Stage 2 (ownership) and Stage 4 (async) are where people quit.** Stage 2 is hard but concrete —
the compiler tells you exactly what's wrong. Stage 4 is abstract with genuinely bad error messages.
Expect both. Nothing is wrong with you when you hit them.

**Months, not weeks**, if you want it to stick.

## The one rule that makes this work

Answer the prediction questions *before* running the code, and answer them honestly. Being wrong on
record and finding out why is the entire mechanism. Nodding along to an explanation afterward feels
like learning and isn't.
