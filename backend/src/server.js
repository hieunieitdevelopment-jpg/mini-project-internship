require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { connectDB } = require("./config/db");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const passport = require("./config/passport"); 
const cookieParser = require("cookie-parser");

 

const app = express();
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1); 
const helmet = require("helmet");

app.use(cors({
    origin: [
        "https://vngovsync.lozido.com",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    credentials: true  
}));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Admin Map Backend Running");
});

// centralized error handler - phai dat sau routes
app.use(errorHandler);

async function startServer() {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}

startServer();

