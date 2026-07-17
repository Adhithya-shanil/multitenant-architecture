const express = require('express');
const stores = require('../data/stores.json');
const products = require('../data/products.json');

const router = express.Router();

/**
 * GET /api/stores
 * Lightweight list used by the home page grid (9 stores, 3 categories x 3 themes).
 */
router.get('/', (req, res) => {
  const list = stores.map(({ id, handle, name, category, theme, tagline, logoEmoji }) => ({
    id,
    handle,
    name,
    category,
    theme,
    tagline,
    logoEmoji,
  }));
  res.json({ stores: list });
});

/**
 * GET /api/stores/:handle
 * This is the "first API" called when a storefront page loads.
 * The response carries `category` and `theme` - the two tokens the
 * frontend stores in state to decide which vertical UI + theme variables to apply.
 */
router.get('/:handle', (req, res) => {
  const store = stores.find((s) => s.handle === req.params.handle);
  if (!store) {
    return res.status(404).json({ error: `Store "${req.params.handle}" not found` });
  }
  res.json({ store });
});

/**
 * GET /api/stores/:handle/products
 * Product listing for a given store. Each product carries a flexible
 * `attributes` (metafields-style) array instead of fixed columns, since
 * a dosage field and a size chart don't share a shape.
 */
router.get('/:handle/products', (req, res) => {
  const store = stores.find((s) => s.handle === req.params.handle);
  if (!store) {
    return res.status(404).json({ error: `Store "${req.params.handle}" not found` });
  }
  const storeProducts = products.filter((p) => p.storeHandle === req.params.handle);
  res.json({ products: storeProducts });
});

module.exports = router;
