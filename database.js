import pg from 'pg';

const { Pool } = pg; //Skapar en pool för att kunna hantera flera databasanslutningar samtidigt
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Krävs för Render
  }

});

export default pool;