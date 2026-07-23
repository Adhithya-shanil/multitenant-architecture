const express = require('express');
const { THEMES } = require('../data/themes');

const router = express.Router();

/**
 * GET /api/themes/:token
 * Resolves a theme token to its CSS-variable dictionary. Addressable on its
 * own (not nested in a store response) so the frontend can cache it once per
 * token instead of re-fetching an identical dictionary for every store that
 * happens to share a theme.
 */
router.get('/:token', (req, res) => {
  const theme = THEMES[req.params.token];
  if (!theme) {
    return res.status(404).json({ error: `Theme "${req.params.token}" not found` });
  }
  res.json({ theme });
});

module.exports = router;
