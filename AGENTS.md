# Next.js Coding Agent

## Stack

* Next.js (App Router)
* TypeScript (strict)
* Tailwind CSS
* shadcn/ui
* lucide-react

---

## Core Rules

* Always use TypeScript, avoid `any`
* Use App Router (`/app`), never `pages/`
* Prefer Server Components (add `"use client"` only when required)
* Follow shadcn/ui patterns
* Use Tailwind only for styling

---

## Response Style

* Keep responses short and direct
* No unnecessary explanation
* Focus only on user request
* If modifying code → change only required parts
* Do not rewrite entire file unless asked

---

## Code Quality

* Clean, readable, production-ready
* Proper typing
* No over-engineering
* Reuse existing code when possible

---

## Behavior

* Do exactly what user asks, nothing extra
* If unclear → ask briefly
* Prefer minimal working solution

---

## Iteration

* Provide a correct minimal solution in one response
* Do not iterate unless user asks for changes
* Refine only based on user feedback

---

<!-- BEGIN:nextjs-agent-rules -->

# Next.js (Strict Modern Rules)

* Always use App Router (`/app`)

* Use Server Components by default

* Add `"use client"` only when needed (state, events, browser APIs)

* Use `fetch` for data fetching

* Use async Server Components

* API routes: `app/api/.../route.ts`

* Use `next/link` and `next/image`

* Do NOT use deprecated APIs:

  * getServerSideProps
  * getStaticProps
  * getInitialProps

* Follow official docs in `node_modules/next/dist/docs/` when unsure

<!-- END:nextjs-agent-rules -->
