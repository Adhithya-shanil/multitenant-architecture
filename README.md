# Happilee — Multi-Tenant, Multi-Vertical Storefront (Prototype)

A prototype e-commerce storefront that runs **9 stores** — 3 categories
(`food`, `clothes`, `pharma`) × 3 visual themes (`theme1`, `theme2`, `theme3`)
— off **one React codebase and one Express backend**, with no per-store code
branches. Data is hardcoded JSON (no database) since this is an architecture
test, not a production build.

This exists to explore two separate problems:

- **Multi-tenancy** (backend): many stores, one codebase, data isolated per
  tenant. Handled here by every route being scoped by `handle`/`storeHandle`
  and every JSON record carrying a tenant identifier — trivial to swap for
  `WHERE tenant_id = ?` against a real DB later.
- **Multi-vertical, multi-theme frontend**: different stores sell different
  *kinds* of things and want different *looks*, without forking the UI code
  per store. This is the part this prototype actually focuses on.

## Quickstart

```bash
# terminal 1 - backend (http://localhost:4000)
cd backend
npm install
npm run dev

# terminal 2 - frontend (http://localhost:5173, proxies /api -> :4000)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`, pick any of the 9 stores. A Postman collection
covering every backend endpoint lives in `backend/postman/`.

## Repo layout

```
backend/
  src/
    data/            stores.json, products.json - hardcoded tenant data
    routes/          /api/stores, /api/stores/:handle, /api/stores/:handle/products
  postman/           Postman collection for the API
  server.js

frontend/
  src/
    api/             fetch wrappers for the backend
    context/         StoreContext (current store's id/category/theme)
    theme/           theme token -> CSS variable maps + <ThemeProvider>
    config/           categoryConfig.js - per-category copy/labels/nav links
    core/            shared components used by every store, unmodified
    verticals/       category-specific components (the "genuinely different bits")
    pages/           route-level components (Home, Store, Cart, Checkout, 404)
```

## How a store page works, end to end

1. `/:handle` renders `StorePage`, which wraps everything in `StoreShell`.
2. `StoreShell` calls `GET /api/stores/:handle` — the **first API** — and
   shows `LoadingSpinner` until it resolves.
3. The response carries the store's `category` and `theme` tokens. These get
   stored as React state via `StoreContext.Provider` — nothing below this
   re-fetches or re-derives them.
4. `ThemeProvider` reads the `theme` token and applies that theme's CSS
   variables (`--color-primary`, `--radius-card`, ...) to a wrapping `<div>`.
   Every themed component just reads `var(--color-primary)` — no per-theme
   JS branches anywhere.
5. `CartProvider` is mounted scoped to `store.handle`, so each store's cart
   persists to its own `localStorage` key and never leaks into another
   store's cart.
6. `Navbar` / `Footer` / `StoreProducts` render next, all reading `category`
   from context to decide labels, nav links, and section titles via
   `config/categoryConfig.js` — one JSON-like config object per category, no
   `if (category === 'food')` scattered through components.
7. Products come from a second API (`GET /api/stores/:handle/products`).
   Each product carries a flexible `attributes` array (metafields-style)
   instead of fixed columns, since a `dosage` field and a `size` chart don't
   share a shape.

## The two extensibility seams

**Theming** (`frontend/src/theme/themes.js`): a theme is just a flat object
of CSS variable names to values. `<ThemeProvider theme="theme2">` sets them
as inline styles on a wrapper div; every component underneath reads
`var(--color-primary)`, `var(--radius-card)`, `var(--font-heading)`, etc.
Adding `theme4` means adding one object to this file — zero component
changes.

**Verticals** (`frontend/src/verticals/`): `core/` holds every component
that's identical across all 9 stores (Navbar, Footer, ProductCard's shell,
Cart, Checkout). The bits that are genuinely different per category —
spice level + modifiers for `food`, a size selector + size chart for
`clothes`, a prescription-upload gate for `pharma` — live in
`verticals/<category>/` and are wired in through a single lookup table,
`verticals/registry.js`. `ProductCard` never imports a vertical directly;
it asks the registry for "whatever category-specific component (if any)
applies here" and renders that. Adding a 4th vertical (e.g. `electronics`)
means: one new folder in `verticals/`, one new entry in `registry.js`, one
new entry in `categoryConfig.js` — `core/` stays untouched.

## Metafields-style product attributes

Backend `products.json` gives every product an `attributes` array instead of
fixed columns:

```json
{ "key": "size", "label": "Size", "type": "select", "options": ["S","M","L","XL"], "value": "M" }
```

`ProductCard` renders any attribute it doesn't recognize as a plain
read-only badge (`formatAttribute`). Attributes a vertical component already
renders interactively (e.g. `size`, `spice_level`, `requires_prescription`)
are excluded from the badge list via `registry.js`'s `handledKeys`, so
nothing is shown twice.

## Cart & checkout

Cart line items are keyed by product **+ selections** (`lineId`), so e.g.
the same t-shirt added in size `M` and size `L` are two separate lines, not
one line with quantity 2. Selections (size, spice level, modifiers, ...) are
attached to the cart line and rendered back on the Cart and Checkout pages
via `core/cart/formatSelections.js` — one formatter, no per-category cart UI.

Checkout (`/:handle/checkout`) is a single shared page for every category: an
order summary, a name/address form, a payment method picker, and a simulated
"place order" step that clears the cart and shows an order confirmation.
Nothing here branches on category — vertical concerns (like "this item needs
a prescription") are already resolved before checkout, at the point where
`ProductCard` blocks "Add to Cart" until the vertical component reports
`isReady`.

## What's intentionally not here (it's a prototype)

- No database — `stores.json` / `products.json` stand in for tenant tables.
- No auth/accounts.
- No real payments — checkout fakes a delay and generates a fake order id.
- No image uploads — the "prescription upload" only reads a filename, it
  doesn't actually send the file anywhere.
