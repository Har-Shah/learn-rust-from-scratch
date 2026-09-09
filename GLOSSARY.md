# Glossary

Rust terms in plain language.

**How to use this file:** entries marked *(seeded)* were written by Claude to establish the format.
Every other entry should be written **in my own words** after I understand the concept — rewriting a
seeded entry in my own words is a good sign the concept landed. A term I cannot define without
looking it up is a term I have not learned yet.

---

## A

## B

## C

**Cargo** *(seeded)* — Rust's build tool and package manager. Roughly `pip` + `venv` +
`pyproject.toml` + a build system + a test runner, in one program.

**Cargo.lock** *(seeded)* — records the exact dependency versions actually used, so a build is
reproducible. Comparable to a pinned `requirements.txt` or `poetry.lock`.

**Cargo.toml** *(seeded)* — the manifest: package name, version, edition, dependencies. The rough
equivalent of `pyproject.toml`.

**Compile time** *(seeded)* — while `rustc` is turning source into a binary, before the program
runs. Contrast **runtime**.

**Crate** *(seeded)* — the unit of compilation. Not a single file: a whole crate is compiled
together as one thing. A crate is either a *binary* crate (has `main`, produces an executable) or a
*library* crate (produces something other crates can use).

## D

## E

**Edition** *(seeded)* — an opt-in generation of Rust (2015, 2018, 2021, 2024) that permits changes
which would otherwise break old code. Crates on different editions interoperate freely.

## F

## G

## H

## I

## J

## K

## L

## M

## N

## O

## P

## Q

## R

**runtime** *(seeded)* — while the compiled program is actually executing. Contrast **compile
time**. (Also used in a second, unrelated sense in async Rust: an async *runtime* such as Tokio is
the machinery that drives futures. That meaning arrives in Stage 4.)

**rustc** *(seeded)* — the Rust compiler itself. Cargo calls it; it is rarely invoked by hand.

**rustfmt** *(seeded)* — the standard code formatter. Run as `cargo fmt`. Rust culture treats
formatting as settled rather than a matter of taste.

**rustup** *(seeded)* — the toolchain installer and version manager. Manages which `rustc`/`cargo`
version is active, comparable to `pyenv`.

## S

## T

**target/** *(seeded)* — the build output directory. Large, regenerable, and always gitignored.

**Toolchain** *(seeded)* — a matched set of `rustc`, `cargo`, and standard library at a particular
version (for example `stable-aarch64-apple-darwin`).

## U

## V

## W

## X

## Y

## Z
