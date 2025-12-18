const express = require('express');
const router = express.Router();
const { getProducts } = require('../data/store');

// GET /api/products - fetch all products
router.get('/', (req, res) => {
  try {
    const products = getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 