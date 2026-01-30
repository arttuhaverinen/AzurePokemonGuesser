const { app } = require("@azure/functions");
const fetch = require("node-fetch").default;

app.http("GetPokemon", {
	methods: ["GET", "POST"],
	authLevel: "anonymous",
	route: "GetPokemon2/{name}", // ✅ define route param
	handler: async (request, context) => {
		context.log(`Http function processed request for url "${request.url}"`);

		const name = request.params.name;

		try {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
			const data = await response.json();
			console.log(data);
			return { body: JSON.stringify(data) };
		} catch (error) {
			return { body: `Error: ${error}` };
		}
	},
});
