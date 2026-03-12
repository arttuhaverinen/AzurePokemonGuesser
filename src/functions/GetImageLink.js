const { app } = require("@azure/functions");
const {
	BlobSASPermissions,
	generateBlobSASQueryParameters,
	StorageSharedKeyCredential,
} = require("@azure/storage-blob");

require("dotenv").config();

app.http("GetImageLink", {
	methods: ["GET"],
	authLevel: "anonymous",
	route: "imagelink/{profilepic}",
	handler: async (request, context) => {
		const account = process.env.STORAGE_ACCOUNT_NAME;
		const accountKey = process.env.STORAGE_ACCOUNT_KEY;

		const containerName = "pokemonguesserblobstorage";
		//const blobName = "Arttu Haverinen+142.webp";
		const blobName = `${request.params.profilepic}.webp`;

		console.log(blobName);

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

		return { status: 200, jsonBody: { url } };
	},
});
