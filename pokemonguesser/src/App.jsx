import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Pokemon from "./Pokemon";
import Highscores from "./Highscores";

import { useMsal } from "@azure/msal-react";
import { Col, Row, Button } from "react-bootstrap";

function App() {
	const { instance, accounts, inProgress } = useMsal();
	const [count, setCount] = useState(0);
	const isLoggedIn = accounts.length > 0;
	const [username, setUsername] = useState();
	const [refresh, setRefresh] = useState(true);

	useEffect(() => {
		instance.handleRedirectPromise().then((response) => {
			let displayName;

			if (response?.idTokenClaims) {
				displayName =
					response.idTokenClaims.name ||
					response.idTokenClaims.preferred_username ||
					response.idTokenClaims.sub;
			} else if (accounts.length > 0) {
				// Already logged in, fallback to first account
				const account = accounts[0];
				displayName =
					account.name || account.username || account.localAccountId; // localAccountId is like sub
			}

			if (displayName) {
				console.log("Welcome,", displayName);
				setUsername(displayName);
			}
		});
	}, [instance, accounts]);
	return (
		<Router>
			<div className="w-100">
				<Row className="w-100 mx-0 p-0 border-bottom border-black">
					<Col xs={8} className="start-0">
						<h2 className="text-start">PokemonGuesser</h2>{" "}
					</Col>
					<Col xs={4}>
						{" "}
						{!isLoggedIn ? (
							<div>
								<Button
									className="my-1"
									onClick={() =>
										instance.loginRedirect({
											scopes: ["openid", "profile", "email"],
											extraQueryParameters: { prompt: "select_account" },
										})
									}
								>
									Login
								</Button>
							</div>
						) : (
							<h3> {username ? username : null}</h3>
						)}{" "}
					</Col>
				</Row>

				<Pokemon />
			</div>
			<Row className="my-5 border-top border-black">
				<Highscores />
			</Row>
			<Routes>
				<Route path="/Highscores" element={<Highscores />} />
			</Routes>
		</Router>
	);
}

export default App;
