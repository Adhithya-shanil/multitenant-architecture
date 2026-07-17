# verticals/

This is where category-specific UI lives - the genuinely different bits that
shouldn't be forced into one generic component:

- `food/FoodOptions.jsx` - spice level picker (single-select) + add-on modifiers (multi-select)
- `clothes/SizeSelector.jsx` - size + color pickers, plus a static size chart
- `pharma/PrescriptionGate.jsx` - prescription upload gate that blocks "Add to Cart" until satisfied

`registry.js` is the single place that maps a store's `category` token to its
vertical component (and which product attribute keys that component already
renders, so the generic product card doesn't render them twice).

Everything else (Navbar, Footer, ProductCard, Cart, Checkout) lives in
`src/core/` and is shared, unmodified, across every category. `core/`
components never import from `verticals/` directly - they go through
`registry.js`, so adding a 4th category means adding a folder here and one
line in the registry, not touching `core/`.
