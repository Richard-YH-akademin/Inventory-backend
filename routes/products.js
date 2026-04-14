import express from 'express';//Behöver Express för att kunna skapa en Router
const router = express.Router();//Skapar en mini-Router
import pool from "../db/db.js";//Verktyget som gör att vi kan prata med databasen direkt med SQL
 
//GET /api/products
router.get('/', async (req, res) => {
  try {
    const FILTERABLE_FIELDS = ['user_id', 'status_id', 'purchased_to', 'arrived_from', 'article', 'make', 'model'];

    //Vitlista för sortering. Kan utvecklas till att bli fler fält
    const SORTABLE_FIELDS = ['article', 'status', 'warranty_start', 'warranty_end'];
 
    //Vilken av parametrarna man vill söka på hamnar här i denna tomma array. Tex user_id
    const conditions = [];
    //Värdet i filtreringen hamnar här. Tex, 5 eller röd.
    const values = [];
 
    //fritext sökning på utrustningsid.
    // Om något skrivs i sökfältet går vi in i detta block
    if (req.query.equipment_id) {
      values.push(`%${req.query.equipment_id}%`);//Det som söks på, tex "H" letas efter i hela equipment_id-strängen
      //Push är motsvarighet till Add() i C#
      //
      conditions.push(`equipment_id::text ILIKE $${values.length}`); //ILIKE = gör den case-insensitive
    }
 
    //Filter
    //req.query är ett objekt som innehåller Nyckel-värde-par
    //Object.entries(req.query) gör så att informationen i req.query blir till en array av par (alltså nyckel-värde-par). Tex. ["category", "laptop"], ["status", "active"]
    //Anledningen till att man gör det till en array är för att man inte kan loopa igenom ett objekt med foreach.
    //Foreach loopar igenom varje par och delar upp dem i key och value. Det kallas deconstructuring.
    if (req.query.category_id){ //är det en array? används som är. Är det en sträng? Lägg in i array
      const ids = Array.isArray(req.query.category_id)
        ? req.query.category_id //redan en array om flera skickades
        : [req.query.category_id]; //gör om ensamt värde till array

      const placeholders = ids.map((_, i) => `$${values.length + i + 1}`).join(', ');
      ids.forEach(id => values.push(id));
      conditions.push(`p.category_id IN (${placeholders})`);
    }

    Object.entries(req.query).forEach(([key, value]) =>{
    //If-satsen kollar om det som finns i key också finns i vit-listan vi skapat. Det andra villkoret i denna if-sats är att value inte är tomt
      if (FILTERABLE_FIELDS.includes(key) && value) {
        //Loopar igenom och lägger till i values. Tex efter två loopar kan det se ut såhär values = ["laptop", "active"]
        values.push(value);
        //Skapar en query med vilken key och vilket värde. Värdet kopplas baserat på platsen i values-listan. Detta för att säkerställa att t.ex. category inte får värdet active
        //Denna kod ger arrayen conditions = ["category = $1", "status = $2"]
        conditions.push(`p.${key} = $${values.length}`);
      }
    });
    //Det är en kompakt if-sats som säger att om det finns minst ett condition - sätt ihop alla conditions till en sträng med Join. Om det finns noll conditions sätt whereClause till en tom sträng
    //Join gör så att de olika arrayerna i listan läggs ihop till en sträng med AND mellan t.ex. "category = $1 AND status = $2"
    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

      //Sortering: Hämtar sortBy och sortOrder från frontend.
      //Om frontend inte skickar något används product_id och DESC som standard
      const sortBy = SORTABLE_FIELDS.includes(req.query.sortBy)
      ? req.query.sortBy : 'product_id';

      //Ser till att det bara är ASC eller DESC som kan placeras i queryn.
      const sortOrder = req.query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

 
    //Query skickas in till databasen och query med värden sätts ihop tack vare pool.query
    const result = await pool.query(
      `SELECT
      p.*,
      c.name AS category,
      u.last_name || ', ' || u.first_name AS user_name,
      s.name AS status,
      DATE_PART('day', NOW() - p.created_at)::INTEGER AS inventory_age_days
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN status s ON p.status_id = s.status_id
       ${whereClause} ORDER BY ${sortBy} ${sortOrder}`,
      values
    );
    //res.json sickar tillbaka det som hittades med queryn som JSON. Om inget hittas är resultatet bara tomt.
    res.json(result.rows);
    //Om något går fel fångas det upp
  } catch (error) {
    console.error(error);//Detta skrivs ut i serverns terminal till utvecklaren
    res.status(500).json({ error: error.message });//Skickar felsvar till frontend för att appen ska kunna visa ett felmeddelande. Statuskoden 500 betyder att något gick fel på servern
  }
});

//GET api/products/stats
//Kort för vilka producter som är aktiva, inaktiva och avvecklade
router.get("/stats", async (req, res) => {
  try {
    //query som hämtar hur många som finns av varje status. FILTER gör så att allt hamnar på en rad och därmed resulterar i ett objekt
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status_id = 1) AS active,
        COUNT(*) FILTER (WHERE status_id = 2) AS inactive,
        COUNT(*) FILTER (WHERE status_id = 3) AS decommissioned
      FROM products
    `);

    //deconstructering. Plockar ut alla värdena samtidigt och tilldelar till variablerna. Detta är för att tilldela värdena till de olika variablerna. Ett kortare sätt att skriva 
    //const active = result.rows[0].active
    //const inactive = result.rows[0].inactive
    //const decommissioned = result.rows[0].decommissioned
    //Man vill ha ett objekt istället för tre för att det blir smidigare att jobba med i frontend
    const { active, inactive, decommissioned } = result.rows[0];

    //Skickar svar till frontend
    res.json({
      active:           Number(active),//Number omvandlar strängvärdet till ett nummer
      inactive:         Number(inactive),
      decommissioned:   Number(decommissioned),
    });
    //Fångar upp om något går fel
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte hämta statistik" });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT category_id, name FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/products/users
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT user_id, last_name || ', ' || first_name AS name 
            FROM users 
            ORDER BY last_name, first_name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/products/statuses
router.get('/statuses', async (req, res) => {
    try {
        const result = await pool.query('SELECT status_id, name FROM status ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/products/makes
router.get('/makes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT make
      FROM products
      WHERE make IS NOT NULL
      ORDER BY make
      `);
      res.json(result.rows);
    } catch (error){
      console.error(error);
      res.status(500).json({error: error.message});
    }
});

router.get('/articles', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT article
      FROM products
      WHERE article IS NOT NULL
      ORDER BY article
      `);
      res.json(result.rows);
    } catch (error){
      console.error(error);
      res.status(500).json({error: error.message});
    }
});

router.get('/models', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT model
      FROM products
      WHERE model IS NOT NULL
      ORDER BY model
      `);
      res.json(result.rows);
    } catch (error){
      console.error(error);
      res.status(500).json({error: error.message});
    }
});

router.get('/arrivedfrom', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT arrived_from
      FROM products
      WHERE arrived_from IS NOT NULL
      ORDER BY arrived_from
      `);
      res.json(result.rows);
    } catch (error){
      console.error(error);
      res.status(500).json({error: error.message});
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try{
    //deconstructurerar objektet req.params och plockar ut id. req.params innehåller parametrarna från URL:en och har därmed id som en parameter
    const {id} = req.params;
    //Skickar query-sträng med id som andra inparameter. [Id] betyder att det är en array med ett enda värde
    const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
 //Om resultatet är 0 skickas felmeddelande. === betyder att det måste vara just 0.
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produkten hittades inte' });
    }

  //Själva objektet skickas direkt istället för en hel array, eftersom det alltd bara kommer vara en rad, dvs ett objekt och då är det lättare att ta emot i frontenden för att man inte behöver gå in i en array och hämta ut objektet där
    res.json(result.rows[0]);
  } catch(error) {
    res.status(500).json({ error: error.message});
  }
});
 
router.post('/', async (req, res) => {
  try{
    //deconstruct alla värden som skickas in i formuläret i frontenden
    const { equipment_id,
    article,
    make,
    model,
    status_id,
    warranty_start,
    warranty_end,
    purchase_value,
    arrived_from,
    purchased_to,
    notes,
    category_id,
    user_id,
    created_at} = req.body;

    const result = await pool.query(
      `INSERT INTO products (
        equipment_id, article, make, model, status_id,
        warranty_start, warranty_end, purchase_value,
        arrived_from, purchased_to, notes, category_id, user_id, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14
      ) RETURNING *,
       DATE_PART('day', NOW() - created_at)::INTEGER AS inventory_age_days`, //Returning är en bekräftelse på vad som skapats, alltså man får se vad man skapat
       //Värdena som ska placeras på siffrornas plats
      [
        equipment_id, article, make, model, status_id,
        warranty_start, warranty_end, purchase_value,
        arrived_from, purchased_to, notes, category_id, user_id, created_at || new Date()
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
 
const ALLOWED_FIELDS = ['equipment_id', 'article', 'make', 'model', 'status_id',
  'warranty_start', 'warranty_end', 'purchase_value','arrived_from', 'purchased_to',
  'notes', 'category_id', 'user_id', 'created_at'];
  //bättre att de ligger utanför routern? enkelt att återanvändas/uppdateras utan att rör logiken
  // + skapas en gång, ligger kvar i minnet


router.patch('/:id', async (req, res) => {
  //  console.log("PATCH anropades med id:", req.params.id);
  // console.log("Body:", req.body);
  try {
    //Deconstruct av req.params för att plocka ut värdet för id
    const { id } = req.params;
 
    //Object.entries (req.body) gör om objektet till en array med arrays
    //Object.fromEntries gör arrayen till ett objekt igen
    //filter plockar ut key för att kontrollera att det som står i key finns i vitlistan, annars ta bort det
    const fields = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => ALLOWED_FIELDS.includes(key))
    ); //filtrera bort det som inte finns i "vitlistan"
 
    //Skapar en lista med bara namnen på nycklarna och om ingen key finns (för att det kanske filtrerades bort i koden tidigare) så kommer felmeddelande
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'Inga giltiga fält att uppdatera' });
    }
   //
    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', '); //bygg SET-klausul dynamiskt, t ex model = $1, make = $2
 
      //... spread, ett sätt att deconstruct utan att välja vilka specifika värden som ska plockas ut.
      //En lista med vlues skapas så att den består av en array med flera värden. const values = [...["Laptop", "active"], 3] blir istället const values = ["Laptop", "active", 3], alltså inte nästlade arrays.
    const values = [...Object.values(fields), id];
 
    const result = await pool.query(
      `UPDATE products SET ${setClause} WHERE product_id = $${values.length} RETURNING *,
      DATE_PART('day', NOW() - created_at)::INTEGER AS inventory_age_days`,
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