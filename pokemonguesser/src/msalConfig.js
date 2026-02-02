const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const AUTHORITY = import.meta.env.VITE_AUTHORITY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export const msalConfig = {
	auth: {
		clientId: CLIENT_ID,
		authority: AUTHORITY,
		redirectUri: REDIRECT_URI,
		postLogoutRedirectUri: REDIRECT_URI,
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
};
