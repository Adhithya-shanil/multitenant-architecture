const express = require('express');
const { CATEGORY_CONFIG } = require('../data/categoryConfig');

const router = express.Router();

/**
 * GET /api/categories/:token
 * Resolves a category token to its config (nav links, footer note, section
 * title, vertical widget key). Addressable on its own so the frontend can
 * cache it once per token instead of re-fetching an identical config for
 * every store that happens to share a category.
 */
router.get('/:token', (req, res) => {
  const category = CATEGORY_CONFIG[req.params.token];
  if (!category) {
    return res.status(404).json({ error: `Category "${req.params.token}" not found` });
  }
  res.json({ category });
});

module.exports = router;
