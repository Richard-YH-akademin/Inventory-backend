import express from "express";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } from "../authConfig";

const router = express.Router();

//Skapar en MSAL-klient med vår config
//ConfidentialClientApplication är för backendappar som kan/ska hålla hemligheter
const msalClient = new ConfidentialClientApplication({auth: msalConfig.auth});


//Route 1 Skicka användaren till Microsoft för inloggning
//Frontend anropar denna när användaren klickar på "Logga in"
router.get("/login", async (req, res) => {
    try{
        //Skapar en url till Microsofts inloggningssida
        const authUrl = await msalClient.getAuthCoderUrl({
            scopes: ["openid", "profile", "email"], //Berättar för Microsoft vad vi behöver läsa från användarkontot
            redirectUri: REDIRECT_URI,
        });

        //Skickar användaren till Microsoft
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
            redirectUri: REDIRECT_URI,
        });

        //Hämtar användarinfo från token
        const user = {
            name: tokenResponse.account.name,
            email: tokenResponse.account.username,
        };

        //Skickar användaren tillbaka till frontend med användarinfo
        res.redirect(`http://localhost:5173?user=${JSON.stringify(user)}`);
    } catch (error) {
        console.error("Redirect error: ", error);
        res.status(500).json({error: error.message});
    }
});

//Route 3 Logga ut användare
router.get("/logout", (req, res) => {
    res.redirect(POST_LOGOUT_REDIRECT_URI);
});

export default router;