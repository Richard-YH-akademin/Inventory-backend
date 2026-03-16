import 'dotenv/config';
import express from "express";
import cors from "cors";
import { products } from "./db/mockData.js";// Ta bort detta
import productRouter from './routes/products.js';

 
const app = express();
 
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"]
}));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API fungerar");
// });

// app.get("/api/products", (req, res) => {
//    console.log("Inventory route called");
//    res.json(products);

//  });

app.use("/api/products", productRouter)
 
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
