const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();
const jwt = require("jsonwebtoken");

app.http("GetProfile", {
	methods: ["GET"],
	authLevel: "anonymous",
	route: "profile", // Endpoint: /api/highscores
	handler: async (request, context) => {
		console.log(request.headers.authorization);
		console.log(request.headers);
		console.log(request.headers.Connection);
		console.log(request.headers.connection);
		console.log(request.headers.get("Connection"));
		authHeader = request.headers.get("Authorization");

		console.log("auth header", authHeader);

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return { status: 401, body: "User not authenticated" };
		}

		const token = authHeader.split(" ")[1];

		console.log(token);
		try {
			// Decode without verifying just to check user info
			const decoded = jwt.decode(token);

			console.log("Decoded token:", decoded);

			return {
				status: 200,
				body: {
					message: "User is authenticated",
					user: decoded,
				},
			};
		} catch (err) {
			return { status: 401, body: "Invalid token" };
		}
	},
});
