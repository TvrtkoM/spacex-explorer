# SpaceX Explorer

A frontend application for browsing SpaceX launches, built with Next.js 16, React 19, and TypeScript.

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start  # production build
```

## Architecture decisions

### App Router (Next.js 16)

Chose **App Router** over Pages Router because:

- Server Components let us fetch launch details server-side on the detail page, so metadata (title, description) is populated before the HTML lands — better SEO and no layout shift.
- Async `params` / `searchParams` (mandatory in Next.js 16) are well-supported in App Router.
- Layouts compose cleanly without prop-drilling.

The launches *list* page is a Client Component because it needs interactive filters & infinite scroll, and accumulated state across pages

### TanStack Query (React Query v5) over SWR

- **Accumulate pages client-side** while keeping each page in the cache; individual pages stay deduplicated and stale-while-revalidate.
- **Built-in retry with configurable delay**: `retryDelay` uses exponential backoff; `retry` callback skips retries on 4xx (except 429) so we don't hammer the API on bad requests.
- **`keepPreviousData`**: filter changes show the previous result set while the new query loads, no flash of empty state.
- **`useQueries`**: the Favorites page fetches N launches in parallel with a single hook, automatically deduplicating against the shared cache.

### SpaceX API usage

All list queries go through `POST /launches/query` with options:

```json
{
  "query": {
    "upcoming": false,
    "success": true,
    "name": { "$regex": "starlink", "$options": "i" },
    "date_utc": { "$gte": "2021-01-01T00:00:00.000Z" }
  },
  "options": {
    "sort": { "date_utc": "desc" },
    "limit": 12,
    "page": 2,
    "pagination": true
  }
}
```

This means **all filtering, sorting, and pagination happens server-side** — we never fetch all launches and filter client-side. The response includes `totalDocs`, `hasNextPage`, `nextPage` etc., which drive the infinite scroll.

Rocket and launchpad details are fetched by ID on the detail page using `GET /rockets/:id` and `GET /launchpads/:id`, both cached with a 10-minute stale time (they change infrequently).

### Retry / backoff

`fetchWithRetry` in `lib/api.ts` handles 429 and 5xx responses at the fetch layer with exponential backoff (500ms → 1000ms → 2000ms). TanStack Query's `retryDelay` provides a second layer for the query lifecycle.

## Performance

- **Server-side pagination**: each request fetches exactly 48 launches — no over-fetching.
- **Infinite scroll with virtualization**: virtualization done with @tanstack/react-virtual library, launches list only shows a subset of data that has to be shown to reduce DOM load
- **`memo`** on `LaunchCard`: prevents re-renders when the parent list re-renders after a new page loads.
- **`keepPreviousData`**: filter changes show the old results while the new query is in-flight, eliminating skeleton flashes on every filter interaction.
- **Stale times**: 1 minute on launches; a0 minutes on rockets/launchpads.
- **Parallel fetching**: on the Favorites page, `useQueries` fans out N individual launch fetches that share the query cache with the list page — no duplicate network requests.

## Accessibility

- All interactive elements have visible focus rings (`focus-visible:outline-2`).
- `LaunchCard` uses an `<article>` with a full-card `<Link>` overlay; the favorite button sits above the overlay with `e.preventDefault()` to avoid double-navigation.
- Filters use `<label>` + `htmlFor` associations; the search input has a visually-hidden `<label>`.
- Loading states use `role="status"` + `aria-label`; error states use `role="alert"`.
- The image gallery uses `role="tablist"` / `role="tab"` + `aria-selected` for thumbnail navigation.
- `aria-current="page"` on the active nav link.
- `aria-pressed` on favorite toggle buttons.
- Semantic HTML throughout: `<main>`, `<header>`, `<nav>`, `<article>`, `<section>`, `<dl>`, `<time>`.

## Tradeoffs and what I'd do next

**SSG / SSR vs Client-side only rendering**: launches page uses SSR and launch details page SSG.
SSR: server fetches data and renders HTML on every request. Browser receives meaningful content immediately. Tradoff of using SSR is that it increases compute cost per request and for CSR this cost doesn't exist
SSG: fastest possible response time and best for SEO. Useful for pages that doesn't change often, like blog posts or in our case details of SpaceX launches so it's not good solution that require highly dynamic content. Another tradeoff is taht application build time grows with number of SSG rendered pages required

SSR/SSG pages can increase code complexity since hydration logic has to be added when using e.g. `@tanstack/query` and requires breaking down logic into Server components.

### What I'd add with more time (TODO)

- **Make reusable components**: components like buttons, dropdowns and similar could be reused by using React components instead of writing same code over again
- **Brand identity**: change colors and component styling to reflect SpaceX brand
- **Launch comparison**: `/compare?a=<id>&b=<id>` route rendering two launches side-by-side. Shareable because the IDs live in the URL.
- **Service worker / offline**: cache favorites and their detail pages for offline support. Current suggestion in Next.js documentation suggest using Serwist library which needs webpack, which is not used for Next.js build process at the moment
- **TSDoc for rest of the app**: currently only code inside lib directory is documented with TSDoc comments. 

### Known limitations

- The SpaceX API is public and unauthenticated; rate limits are undocumented. Retry/backoff handles transient 429s.
- `date` inputs for the date range filter have inconsistent native styling across platforms.
- Gallery images are full-resolution Flickr originals
