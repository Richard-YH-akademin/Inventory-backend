const express = require("express");
const cors = require("cors");
const { products } = require("./db/mockData");
 
const app = express();
 
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API fungerar");
});

app.get("/api/products", (req, res) => {
  console.log("Inventory route called");
  res.json(products);

});
 
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
