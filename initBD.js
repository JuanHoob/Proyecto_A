import getPool from "./getPool.js";

async function createBBDD() {
  try {
    const pool = await getPool();

   
    //Si en vez de crear la BBDD (y borrarla antes) me conectase a ella, añadiría esta línea
    await pool.query(`DROP TABLE IF EXISTS users`)

    console.log("Creando tablas...");

    await pool.query(`
      CREATE TABLE users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);


    console.log("Tablas creadas");
  } catch (e) {
    console.log(e.message);
  } finally {
    process.exit();
  }
}

createBBDD();
