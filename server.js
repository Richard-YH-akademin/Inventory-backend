import "dotenv/config";
import express from "express";
import cors from "cors";
import productRouter from "./routes/products.js";


const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"]
}));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API fungerar");
// });

app.use("/api/products", productRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});