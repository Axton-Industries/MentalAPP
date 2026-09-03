# Graph Report - MentalAPP  (2026-09-03)

## Corpus Check
- Corpus is ~4,814 words - fits in a single context window. You may not need a graph.

## Summary
- 148 nodes · 177 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Dev Tooling & Linting
- App TypeScript Config
- Node TypeScript Config
- UI Components & Pages
- Runtime Dependencies
- Game Logic & Hooks
- Package Metadata
- Root TypeScript Config

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `compilerOptions` - 18 edges
3. `scripts` - 7 edges
4. `Card()` - 6 edges
5. `Button()` - 5 edges
6. `useGameTimer()` - 5 edges
7. `useMathGame()` - 4 edges
8. `useMemoryGame()` - 4 edges
9. `lib` - 4 edges
10. `Input` - 3 edges

## Surprising Connections (you probably didn't know these)
- `useMathGame()` --calls--> `useGameTimer()`  [EXTRACTED]
  src/hooks/useMathGame.ts → src/hooks/useGameTimer.ts
- `useMemoryGame()` --calls--> `useGameTimer()`  [EXTRACTED]
  src/hooks/useMemoryGame.ts → src/hooks/useGameTimer.ts
- `Game()` --calls--> `useMathGame()`  [EXTRACTED]
  src/pages/Game.tsx → src/hooks/useMathGame.ts
- `MemoryGame()` --calls--> `useMemoryGame()`  [EXTRACTED]
  src/pages/MemoryGame.tsx → src/hooks/useMemoryGame.ts

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "Dev Tooling & Linting"
Cohesion: 0.07
Nodes (29): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, gh-pages, globals, devDependencies, eslint (+21 more)

### Community 1 - "App TypeScript Config"
Cohesion: 0.07
Nodes (26): DOM, DOM.Iterable, ES2022, src, vite/client, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly (+18 more)

### Community 2 - "Node TypeScript Config"
Cohesion: 0.09
Nodes (22): ES2023, node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+14 more)

### Community 3 - "UI Components & Pages"
Cohesion: 0.19
Nodes (11): App(), Button(), ButtonProps, Card(), CardProps, categories, Dashboard(), Home() (+3 more)

### Community 4 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): katex, lucide-react, dependencies, katex, lucide-react, react, react-dom, react-katex (+9 more)

### Community 5 - "Game Logic & Hooks"
Cohesion: 0.21
Nodes (11): Input, InputProps, useGameTimer(), GameState, Operation, useMathGame(), GameState, MemoryMode (+3 more)

### Community 6 - "Package Metadata"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, deploy, dev, lint, predeploy (+3 more)

## Knowledge Gaps
- **82 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling & Linting` to `Package Metadata`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _82 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dev Tooling & Linting` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `App TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Node TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._