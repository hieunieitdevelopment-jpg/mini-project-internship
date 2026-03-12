require('dotenv').config()
const express = require('express')
const { connectDB } = require('./config/db')
const routes = require("./routes");

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())


app.use("/api/v1", routes);

app.get('/', (req, res) => {
  res.send('Admin Map Backend Running')
})

async function startServer() {
  await connectDB()   

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()