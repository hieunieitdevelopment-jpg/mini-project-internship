const { Client } = require('pg')

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
})

async function connectDB() {
  try {
    await client.connect()
    console.log('✅ DB Connected')
  } catch (err) {
    console.error('❌ DB Connection Failed:', err.message)
    process.exit(1)
  }
}

module.exports = { client, connectDB }