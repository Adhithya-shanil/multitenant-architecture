const express = require('express');
const stores = require('../data/stores.json');
const products = require('../data/products.json');

const router = express.Router();

/**
 * GET /api/stores
 * Lightweight list used by the home page grid (9 stores, 3 categories x 3 themes).
 * Only carries the `category`/`theme` tokens - resolving what those tokens
 * mean is the job of /api/categories/:token and /api/themes/:token, so a
 * client that already has a token's config cached doesn't need it re-sent.
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
 * This is the "first API" called when a storefront page loads. It only
 * carries the `category`/`theme` tokens - the frontend fetches (and caches)
 * their resolved config separately via /api/categories/:token and
 * /api/themes/:token, so identical tokens across stores aren't re-fetched.
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
