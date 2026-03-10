const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();

app.http("GetProfileImages", {
	methods: ["GET"],
	authLevel: "anonymous",
	route: "profileimages", // Endpoint: /api/highscores
	handler: async (request, context) => {
		const account = process.env.STORAGE_ACCOUNT_NAME;
		const accountKey = process.env.STORAGE_ACCOUNT_KEY;
		const tableName = "PokemonGuesserProfileImages";

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
			const entities = client.listEntities({
				queryOptions: { filter: `PartitionKey eq 'profileimages'` },
			});

			const results = [];
			for await (const entity of entities) {
				console.log(entity.rowKey, entity.imageName, entity.date);
				results.push({
					username: entity.rowKey,
					image: entity.imageName,
					date: entity.date,
				});
			}

			return { body: JSON.stringify(results) };
		} catch (error) {}
	},
});
