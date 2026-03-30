import express from 'express';
const router = express.Router();
import pool from "../db/db.js";
 
//GET /api/products
router.get('/', async (req, res) => {
  try {
    const FILTERABLE_FIELDS = ['user_id', 'status_id', 'purchased_to_user_id', 'arrived_from', 'article', 'make', 'model'];
 
    const conditions = [];
    const values = [];
 
    //fritext sökning på utrustningsid
    if (req.query.equipment_id) {
      values.push(`%${req.query.equipment_id}%`);
      conditions.push(`equipment_id::text ILIKE $${values.length}`); //ILIKE = gör den case-insensitive??
    }
 
    //Filter
    if (req.query.category_id){ //är det en array? används som är. Är det en sträng? Lägg in i array
      const ids = Array.isArray(req.query.category_id)
        ? req.query.category_id //redan en array om flera skickades
        : [req.query.category_id]; //gör om ensamt värde till array

      const placeholders = ids.map((_, i) => `$${values.length + i + 1}`).join(', ');
      ids.forEach(id => values.push(id));
      conditions.push(`category_id IN (${placeholders})`);
    }

    Object.entries(req.query).forEach(([key, value]) =>{
      if (FILTERABLE_FIELDS.includes(key) && value) {
        values.push(value);
        conditions.push(`${key} = $${values.length}`);
      }
    });
 
    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';
 
    const result = await pool.query(
      `SELECT * FROM products ${whereClause} ORDER BY product_id DESC`,
      values
    );
 
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//GET api/products/stats
router.get("/stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status_id = 1) AS active,
        COUNT(*) FILTER (WHERE status_id = 2) AS inactive,
        COUNT(*) FILTER (WHERE status_id = 3) AS decommissioned
      FROM products
    `);

    const { active, inactive, decommissioned } = result.rows[0];

    res.json({
      active:           Number(active),
      inactive:         Number(inactive),
      decommissioned:   Number(decommissioned),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte hämta statistik" });
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
 
 
export default router;