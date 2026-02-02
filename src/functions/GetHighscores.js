const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();

app.http("GetHighscores", {
	methods: ["GET"],
	authLevel: "anonymous",
	route: "highscores", // Endpoint: /api/highscores
	handler: async (request, context) => {
		const account = process.env.STORAGE_ACCOUNT_NAME;
		const accountKey = process.env.STORAGE_ACCOUNT_KEY;
		const tableName = "PokemonGuesserHighscores";

		if (!account || !accountKey) {
			return { status: 500, body: "Storage account keys are missing." };
		}

		const credential = new AzureNamedKeyCredential(account, accountKey);
		const client = new TableClient(
			`https://${account}.table.core.windows.net`,
			tableName,
			credential,
		);

		try {
			const scores = [];
			for await (const entity of client.listEntities({
				queryOptions: { filter: "PartitionKey eq 'highscore'" },
			})) {
				scores.push({
					nickname: entity.rowKey,
					name: entity.name,
					score: entity.score,
					date: entity.date,
				});
			}

			scores.sort((a, b) => b.score - a.score);

			// Return top 10
			return { body: JSON.stringify(scores.slice(0, 10)) };
		} catch (err) {
			context.log.error("Error fetching highscores:", err.message);
			return { status: 500, body: "Error fetching highscores." };
		}
	},
});
