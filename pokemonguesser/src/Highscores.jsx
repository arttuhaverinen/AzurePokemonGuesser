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
		<Row className="w-75 mx-auto">
			<Col className="my-3" xs={3}>
				<h3 className="text-center">Highscores</h3>
			</Col>
			<Col className="my-3" xs={6}>
				<h3 className="text-center"></h3>
			</Col>
			<Col className="my-3" xs={3}>
				<Button
					onClick={() => fetchHighscores()}
					className="border btn btn-light"
				>
					Refresh
				</Button>
			</Col>
			<Row className="w-100">
				<Col xs={3} className="">
					<h4>#</h4>
				</Col>
				<Col xs={3}>
					<h4>Name</h4>
				</Col>
				<Col xs={3}>
					<h4>Score</h4>
				</Col>
				<Col xs={3}>
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
