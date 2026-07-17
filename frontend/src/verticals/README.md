# verticals/

This is where category-specific UI lives - the genuinely different bits that
shouldn't be forced into one generic component:

- `food/` - spice level pickers, add-on modifiers
- `clothes/` - size selector, size chart
- `pharma/` - prescription upload, dosage/prescription warnings

Everything else (Navbar, Footer, ProductCard, Cart, Checkout) lives in
`src/core/` and is shared, unmodified, across every category.

Populated in Step 7, once the metafields renderer is in place.
