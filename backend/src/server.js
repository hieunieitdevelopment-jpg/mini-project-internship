require("dotenv").config();
const express = require("express");
const path = require("path");
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

// Serve frontend static files (React build)
app.use(express.static(path.join(__dirname, "../public")));

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", routes);

// centralized error handler - phai dat sau routes
app.use(errorHandler);

// SPA fallback - moi route khong match API se tra ve index.html (React Router xu ly)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

async function startServer() {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}

startServer();

