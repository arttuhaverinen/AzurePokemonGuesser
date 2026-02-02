const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();

app.http("Highscores", {
	methods: ["POST"],
	authLevel: "anonymous",
	route: "addhighscore", // ✅ define route param
	handler: async (request, context) => {
		const raw = await request.text();
		console.log("Raw body:", raw);

		const account = process.env.STORAGE_ACCOUNT_NAME;
		const accountKey = process.env.STORAGE_ACCOUNT_KEY;
		const tableName = "PokemonGuesserHighscores";

		console.log(account, accountKey);
		const { nickname, score } = JSON.parse(raw);
		console.log(nickname, score);

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

		const credential = new AzureNamedKeyCredential(account, accountKey);
		const client = new TableClient(
			`https://${account}.table.core.windows.net`,
			tableName,
			credential,
		);

		try {
			await client.createEntity({
				partitionKey: "highscore",
				rowKey: `${nickname}-${Date.now()}`,
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
