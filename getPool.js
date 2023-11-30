// Importa la versión asíncrona del módulo "mysql2".
import mysql from "mysql2/promise";
import "dotenv/config"

// Desestructura las variables de entorno desde el archivo ".env".
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

console.log(DB_HOST);

// Declara una variable para almacenar el pool de conexiones.
let pool;

// Crea una función asíncrona para obtener una conexión a la base de datos.
const getPool = async () => {
  try {
    // Si no existe un pool de conexiones, créalo.
    if (!pool) {
      pool = mysql.createPool({
        database: DB_NAME,
        connectionLimit: 10, // Establece un límite máximo de conexiones. Por defecto 10.
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        timezone: "Z", // El valor Z establece la zona horaria como UTC.
      });
    }

    // Retorna el pool de conexiones.
    return pool;
  } catch (err) {
    console.error(err);
  }
};

// Exporta la función "getPool" para usarla en otros archivos de tu proyecto.
export default getPool;