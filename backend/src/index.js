require('dotenv').config()
const express = require('express')
const { connectDB } = require('./db')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Admin Map Backend Running 🚀')
})

async function startServer() {
  await connectDB()   // ⬅️ connect DB trước

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startServer()