import express from 'express';
const router = express.Router();
import pool from "../db/db.js";


// GET /api/products
// router.get('/', async (req, res) => {
//   try{
//     const result = await pool.query('SELECT * FROM products')
//     res.json(result.rows);
//   } catch (error){
//     console.error(error)
//     res.status(500).json({error:error.message});
//   }
// });

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

//POST
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

//PATCH (ska användas när man trycker på pennan för att uppdatera alla fält)
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


//GET /api/products/ FILTER (men också den vanliga GET, metoden? Dvs om ingen filter anges hämtas allt)

router.get('/', async (req, res) => {
  const params = req.query;//Här finns alla keys

  //Basen för sökfrågan
  let query = "SELECT * FROM products";
  let conditions = [];
  let values = [];

  //Loopa igenom alla inkommande query params
  Object.keys(params).forEach((key, index) => {
    //Lägger till villkor i en lista
    conditions.push(`${key} = $${index + 1}`);
    //Lägger till det faktiska värdet i en separat lista
    values.push(params[key]);
  });

  //Om ett filter används, lägg till WHERE och slå ihop dem med AND
  if(conditions.length > 0){
    query += " WHERE " + conditions.join(" AND ");
  }

  try{
    //Skicka frågan till databasen
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error){
    console.error(error)
    res.status(500).json({error:error.message});
  }
});

export default router;