const {
	BlobServiceClient,
	StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const { app } = require("@azure/functions");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
require("dotenv").config();
const { jwtVerify, createRemoteJWKSet } = require("jose");
require("dotenv").config();

app.http("UploadImage", {
	methods: ["POST"],
	authLevel: "anonymous",
	route: "uploadimage",
	handler: async (request, context) => {
		try {
			// Uploaded image must be binary for this to work
			const account = process.env.STORAGE_ACCOUNT_NAME;
			const accountKey = process.env.STORAGE_ACCOUNT_KEY;
			const blobStorage = process.env.AZURE_BLOB_STORAGE;

			const credential = new StorageSharedKeyCredential(account, accountKey);

			//client for the container
			const blobServiceClient = new BlobServiceClient(
				`https://${account}.blob.core.windows.net`,
				credential,
			);

			const containerClient = blobServiceClient.getContainerClient(blobStorage);
			const blobClient = containerClient.getBlockBlobClient("user123.webp");

			const arrayBuffer = await request.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			await blobClient.uploadData(buffer, {
				blobHTTPHeaders: {
					blobContentType:
						request.headers.get("content-type") || "application/octet-stream",
				},
			});
			return { status: 200, body: "ok" };
		} catch (error) {
			console.log(error);
			return { status: 500, body: "Upload failed" };
		}

		/*
		const authHeader = request.headers.get("Authorization");

		const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL));

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


			// upload a blob

			return { body: JSON.stringify("verified user!") };
		} catch (error) {
			return { status: 401, body: JSON.stringify("unauthorized!") };
		}
      */
	},
});
