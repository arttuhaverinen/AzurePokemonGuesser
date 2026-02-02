import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";

const Highscores = () => {
	const [highScores, setHighScores] = useState(null);

	const fetchHighscores = async () => {
		let response = await fetch(
			"https://pokemonguesserapi-b4a3e6edf0cyczb4.westeurope-01.azurewebsites.net/api/highscores",
		);
		let data = await response.json();
		console.log("data", data);
		setHighScores(data);
	};

	useEffect(() => {
		fetchHighscores();
	}, []);

	return (
		<Row>
			<Col className="my-3" xs={9}>
				<h3 className="text-start">Highscores</h3>
			</Col>
			<Col className="my-3" xs={3}>
				<Button
					onClick={() => fetchHighscores()}
					className=" border btn btn-light"
				>
					Refresh
				</Button>
			</Col>
			<Row>
				<Col>
					<h4>#</h4>
				</Col>
				<Col>
					<h4>Name</h4>
				</Col>
				<Col>
					<h4>Score</h4>
				</Col>
				<Col>
					<h4>Date</h4>
				</Col>
			</Row>
			{highScores &&
				highScores.map((item, index) => (
					<Row key={index}>
						<Col>{index + 1}</Col>
						<Col>{item.name}</Col>
						<Col>{item.score}</Col>
						<Col>{new Date(item.date).toLocaleDateString()}</Col>
					</Row>
				))}
		</Row>
	);
};

export default Highscores;
