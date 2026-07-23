# verticals/

This is where category-specific UI lives - the genuinely different bits that
shouldn't be forced into one generic component:

- `food/FoodOptions.jsx` - spice level picker (single-select) + add-on modifiers (multi-select)
- `clothes/SizeSelector.jsx` - size + color pickers, plus a static size chart
- `pharma/PrescriptionGate.jsx` - prescription upload gate that blocks "Add to Cart" until satisfied

`registry.js` maps a widget key (e.g. `"prescriptionGate"`) to its component.
That key - and which product attribute keys the widget already renders, so
the generic product card doesn't render them twice - now comes from the
backend's `categoryConfig` (see `backend/src/data/categoryConfig.js`), not
from a category token resolved here. A component reference can't travel over
JSON, so this registry is the one remaining place a server-sent string gets
turned into actual code.

Everything else (Navbar, Footer, ProductCard, Cart, Checkout) lives in
`src/core/` and is shared, unmodified, across every category. `core/`
components never import from `verticals/` directly - they go through
`registry.js`, so adding a 4th category means adding a folder here, one line
in the registry, and one entry in the backend's category config - not
touching `core/`.
