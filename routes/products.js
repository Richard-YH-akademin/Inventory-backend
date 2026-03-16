import express from 'express';
const router = express.Router();
//import { products } from '../db/mockData';
import pool from "../db/db.js";
//const pool = require('../db')

// GET /api/products
router.get('/', async (req, res) => {
  try{
    const result = await pool.query('SELECT * FROM products')
    res.json(result.rows);
  } catch (error){
    console.error(error)
    res.status(500).json({error:error.message});
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try{
    const {id} = req.params;
    const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produkten hittades inte' });
    }
    res.json(result.rows[0]);
  } catch(error) {
    res.status(500).json({ error: error.message});
  }
});

router.post('/', async (req, res) => {
  try{
    const { equipment_id,
    article,
    make,
    model,
    status_id,
    warranty_start,
    warranty_end,
    inventory_age_days,
    purchase_value,
    arrived_from,
    purchased_to_user_id,
    notes,
    category_id,
    user_id} = req.body;
    const result = await pool.query(
      `INSERT INTO products (
        equipment_id, article, make, model, status_id,
        warranty_start, warranty_end, inventory_age_days, purchase_value,
        arrived_from, purchased_to_user_id, notes, category_id, user_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14
      ) RETURNING *`,
      [
        equipment_id, article, make, model, status_id,
        warranty_start, warranty_end, inventory_age_days, purchase_value,
        arrived_from, purchased_to_user_id, notes, category_id, user_id
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

const ALLOWED_FIELDS = ['equipment_id', 'article', 'make', 'model', 'status_id',
  'warranty_start', 'warranty_end', 'inventory_age_days', 'purchase_value', 
  'arrived_from', 'purchased_to_user_id', 'notes', 'category_id', 'user_id'];
  //bättre att de ligger utanför routern? enkelt att återanvändas/uppdateras utan att rör logiken 
  // + skapas en gång, ligger kvar i minnet
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const fields = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => ALLOWED_FIELDS.includes(key))
    ); //filtrera bort det som inte finns i "vitlistan"

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'Inga giltiga fält att uppdatera' });
    }

    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', '); //bygg SET-klausul dynamiskt, t ex model = $1, make = $2

    const values = [...Object.values(fields), id];

    const result = await pool.query(
      `UPDATE products SET ${setClause} WHERE product_id = $${values.length} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produkten hittades inte' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//DELETE /api/products/:id FUNKAR
router.delete('/:id', async (req, res) => {
 
  try {
    const {id} = req.params;
    const result = await pool.query('DELETE FROM products WHERE product_id = $1', [id]);
    res.status(200).json({message : "Produkt borttagen"});
   
  } catch (error) {
    res.status(500).json({error : error.message});
  }
});

export default router;