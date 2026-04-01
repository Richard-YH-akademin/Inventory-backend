import "dotenv/config";
import express from "express";
import cors from "cors";
import productRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";

const app = express();

//Tillåter att hämta och skicka data från/till dessa adresser. Gör så att back och front litar på varandra.
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
   methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

//För att servern ska kunna läsa JSON-data som skickas i en request. Middleware gör om JSON till JavaScript.
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API fungerar");
// });

//Alla requests som börjar med "/api/products" ska skickas vidare till productRouter
app.use("/api/products", productRouter);

app.use("/auth", authRouter);

//Sätter igång servern som lyssnar efter request från frontend
app.listen(3000, () => {
  console.log("Server running on port 3000");
});