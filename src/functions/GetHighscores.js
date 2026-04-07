const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();
const {
	BlobSASPermissions,
	generateBlobSASQueryParameters,
	StorageSharedKeyCredential,
} = require("@azure/storage-blob");

app.http("GetHighscores", {
	methods: ["GET"],
	authLevel: "anonymous",
	route: "highscores", // Endpoint: /api/highscores
	handler: async (request, context) => {
		const account = process.env.STORAGE_ACCOUNT_NAME;
		const accountKey = process.env.STORAGE_ACCOUNT_KEY;
		const tableName = "PokemonGuesserHighscores";
		const tableNameImages = "PokemonGuesserProfileImages";
		if (!account || !accountKey) {
			return { status: 500, body: "Storage account keys are missing." };
		}

		const credential = new AzureNamedKeyCredential(account, accountKey);
		const client = new TableClient(
			`https://${account}.table.core.windows.net`,
			tableName,
			credential,
		);

		const sharedKeyCredential = new StorageSharedKeyCredential(
			account,
			accountKey,
			);

		const generateSASToken = (imageName) => {
			console.log("blob", imageName);
			const containerName = "pokemonguesserblobstorage";
			const blobName = `${imageName}.webp`;

			const expiry = new Date(new Date().valueOf() + 60 * 60 * 24000); // one day expiry

			const sasToken = generateBlobSASQueryParameters(
				{
					containerName,
					blobName,
					permissions: BlobSASPermissions.parse("r"),
					expiresOn: expiry,
				},
				sharedKeyCredential,
			).toString();

			const url = `https://${account}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
			console.log(url);
			return url;

		}

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

			console.log(scores)

			const clientImages = new TableClient(
				`https://${account}.table.core.windows.net`,
				tableNameImages,
				credential,
			);
			const scoresImages = [];

			for await (const entity of clientImages.listEntities({
				queryOptions: { filter: "PartitionKey eq 'profileimages'" },
			})) {
				scoresImages.push({
					username: entity.rowKey,
					imageName: entity.imageName,

				});
			}

			console.log(scoresImages);

			


			scores.sort((a, b) => b.score - a.score);

			scores.forEach(score => {
				scoresImages.forEach(scoreImage => {
					if(score.nickname == scoreImage.username) {
						console.log("found")
						score.image = scoreImage.imageName;
					} else {
						score.image = null;
					}
				});
			});

			console.log(scores)

			// Generate SAS tokens for highscore avatar images if they exist
			scores.forEach(score => {
				if (score.image != null) {
					console.log("SAS")
					score.imageUrl = generateSASToken(score.image);
				}
			})

			// Return top 10
			return { body: JSON.stringify(scores.slice(0, 10)) };
		} catch (err) {
			context.log.error("Error fetching highscores:", err.message);
			return { status: 500, body: "Error fetching highscores." };
		}
	},
});
