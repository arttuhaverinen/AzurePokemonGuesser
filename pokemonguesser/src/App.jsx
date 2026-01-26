import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Pokemon from "./Pokemon";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1>PokemonGuesser</h1>
			<Pokemon />
		</div>
	);
}

export default App;
