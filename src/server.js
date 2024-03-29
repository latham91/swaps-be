require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConnect = require("./db/connection");

// Route imports
const userRoutes = require("./user/userRoutes");
const listingRoutes = require("./listing/listingRoutes");
const offerRoutes = require("./offer/offerRoutes");

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5001", "https://swaps-fe.netlify.app", "http://localhost:5173"],
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  try {
    return res.status(200).json({ message: "API is healthy" });
  } catch (error) {
    return res.status(500).json({ message: "API not working" });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/offers", offerRoutes);

// Start server
app.listen(port, () => {
  dbConnect();
  console.log(`Server is listening on port ${port}`);
});
