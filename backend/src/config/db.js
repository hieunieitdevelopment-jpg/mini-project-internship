const { Client } = require("pg");

// kiểm tra backend đang kết nối database nào
console.log("Connecting DB:", process.env.DB_NAME);

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

async function connectDB() {

  try {

    await client.connect();

    console.log("DB Connected");

  } catch (error) {

    console.error("DB Connection Failed:", error.message);
    process.exit(1);

  }

}

module.exports = { client, connectDB };