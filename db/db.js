import pg from "pg";//Importerar från node_modules
const { Pool } = pg;//Plockar ut funktionen Pool från biblioteket pg

//Databaskopplingen. Stänger av en del av SSL för att Render har sin egna kryptering/säkring.
//Pool skiljer sig från DbContext i from av att man med en Pool måste skriva SQL själv.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized:false
    }
})

export default pool;