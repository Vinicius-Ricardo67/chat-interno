const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: process.env.DB_DRIVER,
  options: {
    trustedConnection: true,
    enableArithAbort: true
  }
};

async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log("✅ Conectado ao banco de dados!");
  } catch (err) {
    console.error("❌ Erro ao conectar no banco:", err);
  }
}

module.exports = { sql, connectDB };
