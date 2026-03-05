const express = require("express");
const cors = require("cors");
 
const app = express();
 
app.use(cors());
app.use(express.json());

let inventory = [

  { id: 1, name: "Laptop", quantity: 5 },

  { id: 2, name: "Keyboard", quantity: 10 }

];
 
app.get("/", (req, res) => {
  res.send("API fungerar");
});

app.get("/api/inventory", (req, res) => {
  console.log("Inventory route called");
  res.json(inventory);

});
 
app.listen(3000, () => {
  console.log("Server running on port 3000");
});