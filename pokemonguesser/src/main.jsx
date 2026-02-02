import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";
import { MsalProvider } from "@azure/msal-react";

export const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<MsalProvider instance={msalInstance}>
			<App />
		</MsalProvider>
	</StrictMode>,
);
