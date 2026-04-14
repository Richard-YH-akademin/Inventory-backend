import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import productRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";

const app = express();

//Tillåter att hämta och skicka data från/till dessa adresser. Gör så att back och front litar på varandra.
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
   methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

//För att servern ska kunna läsa JSON-data som skickas i en request. Middleware gör om JSON till JavaScript.
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, //Javascript i fronted kan inte läsa cookien
    secure: false, //sätt till true när du kör HTTPS i produktion
    maxAge: 1000 * 60 * 60 * 8 //8 timmar
  }
}));

//Alla requests som börjar med "/api/products" ska skickas vidare till productRouter
app.use("/api/products", productRouter);

app.use("/auth", authRouter);

//Sätter igång servern som lyssnar efter request från frontend
//Byta ut 3000 till annat när vi flyttar till Render
app.listen(3000, () => {
  console.log("Server running on port 3000");
});