const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();
const { jwtVerify, createRemoteJWKSet } = require("jose");

app.http("GetProfile", {
	methods: ["GET"],
	authLevel: "anonymous",
	route: "profile",
	handler: async (request, context) => {
		const authHeader = request.headers.get("Authorization");

		const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL));

		//const token = request.headers.get("x-ms-token-aad-id-token");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return { status: 401, body: "User not authenticated" };
		}
		const token = authHeader.split(" ")[1];

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			console.log("problem with token");
			return { status: 401, body: "User not authenticated" };
		}

		try {
			const { payload } = await jwtVerify(token, JWKS, {
				issuer: process.env.AZURE_TENANT_ID,
				audience: process.env.AZURE_CLIENT_ID,
			});
			return { body: JSON.stringify("verified user!") };
		} catch (error) {
			return { status: 401, body: JSON.stringify("unauthorized!") };
		}
	},
});
