import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import productRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";

const app = express();

//Tillåter att hämta och skicka data från/till dessa adresser. Gör så att back och front litar på varandra.
app.use(cors({
  origin: [process.env.FRONTEND_URL],
   methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

//För att servern ska kunna läsa JSON-data som skickas i en request. Middleware gör om JSON till JavaScript.
app.use(express.json());

app.set('trust proxy', 1); // Lägg denna INNAN session-middlewaren

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, //Javascript i fronted kan inte läsa cookien
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 8 //8 timmar
  }
}));

//Alla requests som börjar med "/api/products" ska skickas vidare till productRouter
app.use("/api/products", productRouter);

app.use("/auth", authRouter);

//Sätter igång servern som lyssnar efter request från frontend
//Byta ut 3000 till annat när vi flyttar till Render
//app.listen(3000, () => {
//  console.log("Server running on port 3000");
const PORT = process.env.PORT || 3000; 
app.listen(PORT, '0.0.0.0', () => { console.log(`Servern körs på port ${PORT}`); 
});