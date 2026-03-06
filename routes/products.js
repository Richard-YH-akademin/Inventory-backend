const express = require('express');
const router = express.Router();
const { products } = require('../db/mockData');

// GET /api/products
router.get('/', (req, res) => {
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find(p => p.equipment_id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Produkt hittades inte' });
  res.json(product);
});

module.exports = router;