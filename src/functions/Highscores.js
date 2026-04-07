const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();
const { jwtVerify, createRemoteJWKSet } = require("jose");

app.http("Highscores", {
	methods: ["POST"],
	authLevel: "anonymous",
	route: "addhighscore", 
	handler: async (request, context) => {
		const raw = await request.text();
		console.log("Raw body:", raw);

		const account = process.env.STORAGE_ACCOUNT_NAME;
		const accountKey = process.env.STORAGE_ACCOUNT_KEY;
		const tableName = "PokemonGuesserHighscores";

		console.log(account, accountKey);
		let { nickname, score } = JSON.parse(raw);
		console.log(nickname, score);
		let authenticatedUser = false;

		// Quick type check
		if (
			typeof nickname !== "string" ||
			(typeof score !== "number" && typeof score !== "string")
		) {
			return {
				status: 400,
				body: "nickname must be a string and score must be a number or numeric string.",
			};
		}

		console.log("json ok");


		// Check if user is registered, not mandatory
		const authHeader = request.headers.get("Authorization");

		console.log(authHeader);

		if (authHeader != null) {
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

		console.log("authheader ok")
		console.log(token)
		try {
			const { payload } = await jwtVerify(token, JWKS, {
				issuer: process.env.AZURE_TENANT_ID,
				audience: process.env.AZURE_CLIENT_ID,
			});


			nickname = payload.name;
			console.log("verified user ", nickname);
			authenticatedUser = true;

		} catch (error) {
			console.log(error)
			return { status: 401, body: JSON.stringify("unauthorized!") };
		}

		console.log("auth ok")

		}

	

		const credential = new AzureNamedKeyCredential(account, accountKey);
		const client = new TableClient(
			`https://${account}.table.core.windows.net`,
			tableName,
			credential,
		);

		try {
			await client.createEntity({
				partitionKey: "highscore",
				rowKey: authenticatedUser ? nickname : `${nickname}-${Date.now()}`,
				name: nickname,
				score: Number(score),
				date: new Date().toISOString(),
			});

			return { body: `HighScore added for ${nickname}` };
		} catch (err) {
			context.log.error(err);
			return { status: 500, body: "Error adding score" };
		}
	},
});
