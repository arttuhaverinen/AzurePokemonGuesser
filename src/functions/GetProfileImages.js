const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();
const {
	BlobSASPermissions,
	generateBlobSASQueryParameters,
	StorageSharedKeyCredential,
} = require("@azure/storage-blob");


app.http("GetProfileImages", {
	methods: ["GET"],
	authLevel: "anonymous",
	route: "profileimages/{username}",
	handler: async (request, context) => {
		const account = process.env.STORAGE_ACCOUNT_NAME;
		const accountKey = process.env.STORAGE_ACCOUNT_KEY;
		const tableName = "PokemonGuesserProfileImages";

		const username = request.params.username;

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
				queryOptions: { filter: `RowKey eq '${username}'` },
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

			console.log(results);
			console.log(results.image);
			console.log(results[0].image);


			// GET SAS TOKEN FOR IMAGE

		const containerName = "pokemonguesserblobstorage";
		//const blobName = "Arttu Haverinen+142.webp";
		const blobName = `${results[0].image}.webp`;

		console.log("blob", blobName);

		const sharedKeyCredential = new StorageSharedKeyCredential(
			account,
			accountKey,
		);

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

		results.push({url: url});

			return { status: 200, jsonBody: results };
		} catch (error) {
			return { status: 500, jsonBody: "error" };
		}
	},
});

/*
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

*/
