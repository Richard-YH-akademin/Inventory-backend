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
            piiLoggingEnabled:false, //Loggen kommer bara berätta att en användare loggade in men inte vem
            logLevel: LogLevel.Info,

        }
    }

};
