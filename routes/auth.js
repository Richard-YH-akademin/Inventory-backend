import express from "express";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { msalConfig } from "../authConfig.js";

//Denna fil hanterar trafiken mellan appen och Microsoft

const router = express.Router();

console.log("DEBUG: Försöker skapa msalClient med:", msalConfig.auth.clientId);
//Skapar en MSAL-klient med vår config
//ConfidentialClientApplication är för backendappar som kan/ska hålla hemligheter
//const msalClient = new ConfidentialClientApplication(msalConfig);
const msalClient = new ConfidentialClientApplication({
    auth: {
        clientId: msalConfig.auth.clientId,
        authority: msalConfig.auth.authority,
        clientSecret: msalConfig.auth.clientSecret
    }
});

//Route 1 Skicka användaren till Microsoft för inloggning
//Frontend anropar denna när användaren klickar på "Logga in"
router.get("/login", async (req, res) => {
    try{
        //Skapar en url till Microsofts inloggningssida
        const authUrl = await msalClient.getAuthCodeUrl({
            scopes: ["openid", "profile", "email"], //Berättar för Microsoft vad vi behöver läsa från användarkontot
            redirectUri: process.env.REDIRECT_URI,
            prompt: "select_account"
        });
        console.log("Fullständig URL som skickas till Microsoft:", authUrl);
        //Skickar användaren till Microsoft på den skapade URL:en
        res.redirect(authUrl);
        //Om något går fel fångas det upp här
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({error: error.message});
    }
});

//Route 2 Ta emot "kvittot" från Microsoft efter inloggning
//Microsoft skickar användaren hit efter lyckad inloggning
router.get("/redirect", async (req, res) => {
    try {
        //Byter ut "kvittot" (code) mot en riktig token
        const tokenResponse = await msalClient.acquireTokenByCode({
            code: req.query.code,
            scopes: ["openid", "profile", "email"],
            redirectUri: process.env.REDIRECT_URI
        });

        //Hämtar användarinfo från token
        req.session.user = {
            name: tokenResponse.account.name,
            email: tokenResponse.account.username,
        };

        //Skickar användaren tillbaka till frontend (utan user i URL:en)
        res.redirect(process.env.FRONTEND_URL);

    } catch (error) {
        console.error("Redirect error: ", error);
        res.redirect(`${process.env.FRONTEND_URL}?error=login_failed`);
    }
});

// Route 3: Vem är jag? (Anropas av React-hooken)
router.get("/me", (req, res) => {
    if (req.session.user) {
        return res.json({ user: req.session.user });
    }
    
    // Om ingen session finns, svara med 401
    console.log("Ingen session hittades vid anrop till /me");
    res.status(401).json({ user: null });
});

//Route 3 Logga ut användare
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect(process.env.POST_LOGOUT_REDIRECT_URI);
    });
    
});

export default router;