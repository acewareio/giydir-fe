# Ultimate Starter Pack
A collection of packages and applications using moon and popular tooling.

[![Pipeline](https://github.com/acewareio/ultimate-starter-pack/actions/workflows/ci.yml/badge.svg)](https://github.com/acewareio/ultimate-starter-pack/actions/workflows/ci.yml)

## Usage

To begin, we suggest installing moon globally: https://moonrepo.dev/docs/install

Once installed, run the following commands for common tasks:

- `moon check --all` - Run _all_ tasks (below).
- `moon run :build` - Build all projects.
- `moon run :lint` - Lint code in all projects.
- `moon run :test` - Run tests in all projects.
- `moon run :format` - Format code in all projects.
- `moon run :typecheck` - Type check code in all projects.

Tasks can also be focused to individual projects. The list of projects can be found in
`.moon/workspace.yml`.

- `moon check <project>`
- `moon run <project>:<task>`
- `moon run <project>:dev` - For applications, starts the development server.

## JavaScript

The following tools are configured as moon tasks.

- ESLint
- Jest
- Packemon
- Prettier
- TypeScript
- Bun
