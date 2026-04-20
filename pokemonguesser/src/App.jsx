import { useState, useEffect } from "react";
import { createContext, useContext } from "react";

import reactLogo from "./assets/react.svg";
import "./App.css";
const VITE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const BASEURL = import.meta.env.VITE_BASEURL;

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Pokemon from "./Pokemon";
import Highscores from "./Highscores";
import Profile from "./Profile";

import { useMsal } from "@azure/msal-react";
import { Col, Row, Button, Image } from "react-bootstrap";

function App() {
	const { instance, accounts, inProgress } = useMsal();
	const [count, setCount] = useState(0);
	const isLoggedIn = accounts.length > 0;
	const [username, setUsername] = useState();
	const [firstname, setFirstName] = useState();
	const [refresh, setRefresh] = useState(true);
	const [accessToken, setAccessToken] = useState(null);

	const AuthProvider = createContext(null);

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
				console.log(displayName.split(" ")[0]);
				setFirstName(displayName.split(" ")[0]);
				setUsername(displayName);
			}
		});
	}, [instance, accounts]);

	const testProtectedEndpoint = async () => {
		console.log("accounts", accounts[0]);
		const tokenResponse = await instance.acquireTokenSilent({
			scopes: [`api://add80d4e-e2b7-4e51-815f-2617074979f6/user_impersonation`],
			account: accounts[0],
		});
		console.log("tokenresponse", tokenResponse);
		const res = await fetch(`${BASEURL}/api/profile`, {
			//const res = await fetch(
			//	"https://pokemonguesserapi-b4a3e6edf0cyczb4.westeurope-01.azurewebsites.net/api/profile",
			//	{
			method: "GET",

			headers: {
				Authorization: `Bearer ${tokenResponse.accessToken}`,
				"Content-Type": "application/json",
			},
		});
		console.log(res);
	};

	return (
		<AuthProvider>
			<Router>
				<div className="w-100">
					<Row
						style={{ minHeight: "100px" }}
						className="w-100 mx-0 my-3 p-0 border-bottom border-black"
					>
						<Col
							xs={12}
							md={4}
							className="d-flex align-items-center justify-content-center"
						>
							<Link to={"/"}>
								<h2 className="text-center">PokemonGuesser</h2>{" "}
							</Link>
						</Col>
						<Col
							xs={12}
							md={4}
							className="d-flex align-items-center justify-content-center"
						>
							<Link to={"/Highscores"}>
								<h2 className="text-center">Highscores</h2>{" "}
							</Link>
						</Col>
						<Col
							xs={12}
							md={4}
							className="d-flex align-items-center justify-content-center"
						>
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
								<Row className="align-items-center">
									<Col
										className="d-flex justify-content-center align-items-center"
										xs={6}
										md={6}
									>
										<Image
											className="my-1"
											src="https://placehold.co/50x50"
											roundedCircle
										/>
										<Link to={"/Profile"} state={{ username: username }}>
											<h3 className="text-center mx-1">{firstname}</h3>{" "}
										</Link>{" "}
									</Col>

									<Col
										className="d-flex justify-content-center align-items-center"
										xs={6}
										md={6}
									>
										<Button
											className="my-1"
											onClick={() =>
												instance.logoutRedirect({
													postLogoutRedirectUri: "/",
												})
											}
										>
											Logout
										</Button>
									</Col>
								</Row>
							)}{" "}
						</Col>
					</Row>
				</div>
				<Row className="my-5"></Row>
				<Routes>
					<Route path="/" element={<Pokemon />} />
					<Route path="/Highscores" element={<Highscores />} />
					<Route path="/Profile" element={<Profile />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
