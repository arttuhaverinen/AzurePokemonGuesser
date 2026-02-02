import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image, Form } from "react-bootstrap";
const BASEURL = import.meta.env.VITE_BASEURL;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

const Pokemon = () => {
	console.log(BASEURL);
	console.log(REDIRECT_URI);
	const [pokemon, setPokemon] = useState();
	const [pokemon2, setPokemon2] = useState();
	const [randomStat, setRandomStat] = useState();
	const stats = [
		"Hitpoints",
		"Attack",
		"Defense",
		"Special attack",
		"Special defence",
		"Speed",
	];
	const [score, setScore] = useState(0);
	const [lives, setLives] = useState(3);
	const [correct, setCorrect] = useState(null);

	const typeColors = {
		normal: "#A8A77A",
		fire: "#EE8130",
		water: "#6390F0",
		electric: "#F7D02C",
		grass: "#7AC74C",
		ice: "#96D9D6",
		fighting: "#C22E28",
		poison: "#A33EA1",
		ground: "#E2BF65",
		flying: "#A98FF3",
		psychic: "#F95587",
		bug: "#A6B91A",
		rock: "#B6A136",
		ghost: "#735797",
		dragon: "#6F35FC",
		dark: "#705746",
		steel: "#B7B7CE",
		fairy: "#D685AD",
	};

	const fetchPokemon = async () => {
		if (lives <= 0) return;
		const random = Math.floor(Math.random() * 150);
		const random2 = Math.floor(Math.random() * 150);
		console.log(random);
		setRandomStat(Math.floor(Math.random() * 6));

		const response = await fetch(`${BASEURL}/api/GetPokemon2/${random}`);
		const result = await response.json();

		const response2 = await fetch(`${BASEURL}/api/GetPokemon2/${random2}`);
		const result2 = await response2.json();
		setPokemon(result);
		setPokemon2(result2);
		console.log(result);
		console.log(result2);
	};

	const checkAnswers = async (answer) => {
		if (lives <= 0) {
			return;
		}

		const response = await fetch(
			`${BASEURL}/api/CheckAnswer?name=${pokemon.name}&name2=${pokemon2.name}&answer=${answer}&stat=${randomStat}`,
		);
		const result = await response.json();
		console.log(result[2]);

		console.log(result[2].correct);

		if (result[2].correct == true) {
			setScore(score + 1);
			setCorrect(true);
		} else {
			setLives(lives - 1);
			setCorrect(false);
		}

		await new Promise((resolve) => setTimeout(resolve, 2000));

		setCorrect(null);

		if (lives == 1 && result[2].correct == false) return;
		fetchPokemon();
	};

	useEffect(() => {
		fetchPokemon();
	}, []);

	return (
		<div>
			{pokemon && (
				<Container className="mt-5 w-75  ">
					<Row className="gap-2 w-100 mx-auto m-0 p-0">
						<h3>Which one has higher {stats[randomStat]}?</h3>
						<Col>
							<Row>
								<Col
									className="border border-2 border-black rounded pokemon-card"
									style={{
										backgroundColor: `${typeColors[pokemon.types[0].type.name]}`,
									}}
									onClick={() => checkAnswers(1)}
								>
									<h2 variant="primary">{pokemon.name}</h2>
									<Image src={pokemon.sprites.front_default}></Image>
									{correct != null ? (
										<h5>{pokemon.stats[randomStat].base_stat}</h5>
									) : (
										<h5>{"\u00A0"}</h5>
									)}{" "}
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col
									className="border border-2 border-black rounded pokemon-card"
									style={{
										backgroundColor: `${typeColors[pokemon2.types[0].type.name]}`,
									}}
									onClick={() => checkAnswers(2)}
								>
									<h2 variant="primary">{pokemon2.name}</h2>
									<Image src={pokemon2.sprites.front_default}></Image>
									{correct != null ? (
										<h5>{pokemon2.stats[randomStat].base_stat}</h5>
									) : (
										<h5>{"\u00A0"}</h5>
									)}{" "}
								</Col>
							</Row>
						</Col>
						{lives >= 1 ? (
							<Row className="d-flex w-100 mx-0 bg-success p-3 border border-2 border-black rounded">
								<Col>
									{" "}
									<h3>Score: {score} </h3>
								</Col>
								<Col>
									{" "}
									<h3>Health: {lives} </h3>
								</Col>
								<Col>
									{correct == true && <h3>Correct!</h3>}
									{correct == false && <h3>Wrong!</h3>}
									{correct == null && <h3> </h3>}
								</Col>
							</Row>
						) : (
							<Row className="bg-warning mx-0 p-3 border border-2 border-black rounded">
								<Col className="">
									{" "}
									<h3>Game over !</h3>
									<h5>Final score: {score}</h5>
									<Button
										onClick={() => {
											setLives(3);
											setScore(0);
											fetchPokemon();
										}}
									>
										Play again
									</Button>{" "}
									<hr />
									<Form className="w-50 mx-auto">
										<Form.Group className="mb-3" controlId="formBasicEmail">
											<Form.Label>Nickname</Form.Label>
											<Form.Control type="text" placeholder="Enter nickname" />
										</Form.Group>

										<Button variant="primary" className="w-100" type="submit">
											Save to highscores
										</Button>
									</Form>{" "}
								</Col>
							</Row>
						)}
					</Row>
				</Container>
			)}
		</div>
	);
};

export default Pokemon;
