import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Col, Row, Button, Image } from "react-bootstrap";

const Highscores = () => {
	const [highScores, setHighScores] = useState(null);

	const fetchHighscores = async () => {
		let response = await fetch(
			"https://pokemonguesserapi-b4a3e6edf0cyczb4.westeurope-01.azurewebsites.net/api/highscores",
			//"http://localhost:7071/api/highscores",
		);
		let data = await response.json();
		console.log("data", data);
		setHighScores(data);
	};

	useEffect(() => {
		fetchHighscores();
	}, []);

	return (
		<Row className="w-75 mx-auto mb-5">
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
			<Row className="w-100 my-3">
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
					<Row className="my-2 align-items-center" key={index}>
						<Col><h5>{index + 1}</h5></Col>
						<Col className=" d-flex justify-content-start align-items-center"> 							
							<Image
										className=""
										src={item.imageUrl ? item.imageUrl : "https://placehold.co/100x100"}
										roundedCircle
										width={100}
										height={100}
							/> 
									<h5 className="mx-2">{item.name}</h5> 
						</Col>
						<Col><h5>{item.score}</h5></Col>
						<Col><h5>{new Date(item.date).toLocaleDateString()}</h5></Col>
					</Row>
				))}
		</Row>
	);
};

export default Highscores;
