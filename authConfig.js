import { LogLevel} from "@azure/msal-node";

//Konfigurationen för MSAL
export const msalConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message) {
                console.log("MSAL Log: ", message);
            },
            piiloggingEnabled:false, //Loggen kommer bara berätta att en användare loggade in men inte vem
            logLevel: LogLevel.Info,

        }
    }

};
//Vart användaren ska skickas när den skrivit in lösen. // SKickas hit för att backend ska ta hand om "kvittot" och validera det.
export const REDIRECT_URI = "http://localhost:3000/auth/redirect";
//När användaren har loggats ut ska den skickas till startsidan/login-sidan
export const POST_LOGOUT_REDIRECT_URI = "http://localhost:5173";