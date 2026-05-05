import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";
import { appConfig } from "./config/appConfig";
import { createLogger } from "./utils/logger";

const logger =
  createLogger("bootstrap");

if (
  !appConfig.googleClientId
) {
  logger.warn(
    "Google OAuth is disabled because VITE_GOOGLE_CLIENT_ID is missing."
  );
}

const appTree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    {appConfig.googleClientId ? (
      <GoogleOAuthProvider
        clientId={
          appConfig.googleClientId
        }
      >
        {appTree}
      </GoogleOAuthProvider>
    ) : (
      appTree
    )}
  </StrictMode>
);
