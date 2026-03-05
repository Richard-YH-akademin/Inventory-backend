const express = require("express");
const cors = require("cors");
 
const app = express();
 
app.use(cors());
app.use(express.json());

let inventory = [

  {  article: "Mobiltelefon",
     make: "Samsung",
     model: "Galaxy",
     equipmentId:"RV908GT5462",
     quantity: 1,
     status: "I drift",
     warrantyPeriodStart: "2025-03-03",
     warrantyPeriodEnd: "2028-03-03",
     ageInventoryDays: 402,
     purchaseValue: 1889,
     arrivedFrom: "Kalle Kallesson",
    purchasedTo: "Lotta Lottsson",
    notes: "Avslutat sin anställning",
    category: "Telefoni",
    user: {
      name: "Anna",
      email: "anna@yh.se",
      avvecklad: false
    }
    },

  {article: "Mobiltelefon",
     make: "Samsung",
     model: "Galaxy",
     equipmentId:"RV908GT5462",
     quantity: 1,
     status: "I drift",
     warrantyPeriodStart: "2025-03-03",
     warrantyPeriodEnd: "2028-03-03",
     ageInventoryDays: 402,
     purchaseValue: 1889,
     arrivedFrom: "Kalle Kallesson",
    purchasedTo: "Lotta Lottsson",
    notes: "Avslutat sin anställning",
    category: "Telefoni",
    user: {
      name: "Anna",
      email: "anna@yh.se",
      avvecklad: false
    }
},
{article: "Mobiltelefon",
     make: "Samsung",
     model: "Galaxy",
     equipmentId:"RV908GT5462",
     quantity: 1,
     status: "I drift",
     warrantyPeriodStart: "2025-03-03",
     warrantyPeriodEnd: "2028-03-03",
     ageInventoryDays: 402,
     purchaseValue: 1889,
     arrivedFrom: "Kalle Kallesson",
    purchasedTo: "Lotta Lottsson",
    notes: "Avslutat sin anställning",
    category: "Telefoni",
    user:{
      name: "Anna",
      email: "anna@yh.se",
      avvecklad: false
    }
},
{article: "Mobiltelefon",
     make: "Samsung",
     model: "Galaxy",
     equipmentId:"RV908GT5462",
     quantity: 1,
     status: "I drift",
     warrantyPeriodStart: "2025-03-03",
     warrantyPeriodEnd: "2028-03-03",
     ageInventoryDays: 402,
     purchaseValue: 1889,
     arrivedFrom: "Kalle Kallesson",
    purchasedTo: "Lotta Lottsson",
    notes: "Avslutat sin anställning",
    category: "Telefoni",
    user: {
      name: "Anna",
      email: "anna@yh.se",
      avvecklad: false
    }
},
{article: "Mobiltelefon",
     make: "Samsung",
     model: "Galaxy",
     equipmentId:"RV908GT5462",
     quantity: 1,
     status: "I drift",
     warrantyPeriodStart: "2025-03-03",
     warrantyPeriodEnd: "2028-03-03",
     ageInventoryDays: 402,
     purchaseValue: 1889,
     arrivedFrom: "Kalle Kallesson",
    purchasedTo: "Lotta Lottsson",
    notes: "Avslutat sin anställning",
    category: "Telefoni",
    user: {
      name: "Anna",
      email: "anna@yh.se",
      avvecklad: false
    }
}

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
