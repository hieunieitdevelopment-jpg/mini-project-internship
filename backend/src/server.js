require("dotenv").config();

const express = require("express");
const { connectDB } = require("./config/db");
const routes = require("./routes");

const app = express();

app.use(express.json());

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Admin Map Backend Running");
});

const PORT = process.env.PORT || 3000;

async function startServer() {

  try {

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("Server start failed:", error);

  }

}

startServer();