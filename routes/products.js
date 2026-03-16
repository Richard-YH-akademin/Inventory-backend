import express from 'express';
import { products } from '../db/mockData.js'; //Ta bort detta
import pool from '../database.js';//Importerar databasen

const router = express.Router();

// GET /api/products (går mot databas, funkar!). Gör endpointen asynkron
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error:'Kunde inte hämta produkter'});
  }
  
});

//POST /api/products. Funkar!
router.post('/', async (req, res) => {
  try {
    const { 
      equipment_id, article, make, model, status_id, 
      warranty_start, warranty_end, inventory_age_days, purchase_value, 
      arrived_from, purchased_to_user_id, notes, category_id, user_id 
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products 
        (equipment_id, article, make, model, status_id, warranty_start, warranty_end, inventory_age_days, purchase_value, arrived_from, purchased_to_user_id, notes, category_id, user_id) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING *`,
      [equipment_id, article, make, model, status_id, warranty_start, warranty_end, inventory_age_days, purchase_value, arrived_from, purchased_to_user_id, notes, category_id, user_id]
    );
      res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
});

// GET /api/products/:id FUNKAR!!
router.get('/:id', async (req, res) => {

  try {
    const {id} = req.params; //Plockar ut id från url:en
    const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]); //$1 betyder att det är index 1, alltså värde nr 1
    res.json(result.rows[0]);//Skriver [0] för att bara få ett objekt, istället för en array. Blir lättare i frontend sen
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//PATCH /api/products/:id
// router.patch('/:id', async (req, res) => {

//   try {
//     const {id} = req.params; //Plockar ut id från url:en
//     const { equipment_id, article, make, model, status_id, warranty_start, warranty_end, inventory_age_days, purchase_value, arrived_from, purchased_to_user_id, notes, category_id, user_id } = req.body;
//     const result = await pool.query(`UPDATE products SET 
//                                     equipment_id = COALESCE($1, equipment_id), 
//                                     article = COALESCE($2, article), 
//                                     make = COALESCE($3, make), 
//                                     model = COALESCE($4, model), 
//                                     status_id = COALESCE($5, status_id), 
//                                     warranty_start = COALESCE($6, warranty_start), 
//                                     warranty_end = COALESCE($7, warranty_end), 
//                                     inventory_age_days = COALESCE($8, inventory_age_days), 
//                                     purchase_value = COALESCE($9, purchase_value), 
//                                     arrived_from = COALESCE($10, arrived_from), 
//                                     purchased_to_user_id = COALESCE($11, purchased_to_user_id), 
//                                     notes = COALESCE($12, notes), category_id = COALESCE($13, category_id), 
//                                     user_id = COALESCE($14, user_id) 
//                                     WHERE product_id = $15 
//                                     RETURNING *`, 
//                                     [equipment_id, 
//                                     article, 
//                                     make, 
//                                     model, 
//                                     status_id, 
//                                     warranty_start, 
//                                     warranty_end, 
//                                     inventory_age_days, 
//                                     purchase_value, 
//                                     arrived_from, 
//                                     purchased_to_user_id, 
//                                     notes, category_id, 
//                                     user_id, 
//                                     id]);
//     res.json(result.rows[0]);
//   } catch (error) {
//     res.status(500).json({error: error.message});
//   }

// });

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