const { app } = require("@azure/functions");
const fetch = require("node-fetch").default;

app.http("CheckAnswer", {
	methods: ["GET", "POST"],
	authLevel: "anonymous",
	//route: "CheckAnswer/{name}/{name2}/{answer}/{stat}", // ✅ define route param
	handler: async (request, context) => {
		context.log(`Http function processed request for url "${request.url}"`);

		console.log("CheckAnswer");

		const name = request.query.get("name");
		const name2 = request.query.get("name2");
		const answer = request.query.get("answer");
		const stat = request.query.get("stat");

		const names = [name, name2];

		try {
			const results = await Promise.all(
				names.map(async (name) => {
					const res = await fetch(
						`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`,
					);
					if (!res.ok) return null;
					return res.json();
				}),
			);

			console.log(results[0].stats[1].base_stat);
			console.log(results[1].stats[1].base_stat);

			const answers = [
				{ attack: results[0].stats[stat].base_stat },
				{ attack2: results[1].stats[stat].base_stat },
				{
					correct:
						answer == 1
							? results[0].stats[stat].base_stat >
								results[1].stats[stat].base_stat
							: results[1].stats[stat].base_stat >
								results[0].stats[stat].base_stat,
				},
			];

			return { body: JSON.stringify(answers) };
		} catch (error) {
			return { body: `Error: ${error}` };
		}
	},
});
