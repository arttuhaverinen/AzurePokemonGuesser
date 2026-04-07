import React, { useEffect, useState } from "react";
import { Col, Row, Button, Image } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import UploadImage from "./UploadImage";
const BASEURL = import.meta.env.VITE_BASEURL;

const Profile = () => {
	const location = useLocation();
	const { username } = location.state || {}; // fallback in case state is undefined
	const [profileImageSAS, setProfileImageSAS] = useState(null);

	const fetchProfile = async () => {
		console.log("res profile");
		const res = await fetch(`${BASEURL}/api/profileimages/${username}`);
		let data = await res.json();
		console.log("res profile", data);
		let image = data[0].image;
		console.log(data[1].url)
		//const imgLink = await fetch(`${BASEURL}/api/imagelink/${image}`);
		//let imgLinkData = await imgLink.json();

		//console.log("res profile link", imgLinkData);
		setProfileImageSAS(data[1].url);
	};

	useEffect(() => {
		if (username) {
			fetchProfile();
		}
	}, []);

	return (
		<Row className="mx-auto w-75 d-flex  justify-content-center align-items-center" >
			{console.log("SAS", profileImageSAS)}
			<Col className="mb-5" xs={12} >
				<h3>Welcome, {username}</h3>
			</Col>
			<Col className="" md={12} lg={4}>
				{" "}
				<Image
					className="my-5  "
					src={
						profileImageSAS ? profileImageSAS : "https://placehold.co/100x100"
					}
					roundedCircle
					height={"200px"}
					width={"200px"}
				/>
			</Col>
			<Col
			xs={12} md={4}
			className="d-flex flex-column justify-content-center align-items-center"
			>
			<h5>Upload new profile picture</h5>
			<UploadImage />
			</Col>
			<br />
			<Col  xs={12}><hr /></Col>
			<Col><h5>Your personal highscores...</h5></Col>

		</Row>
	);
};

export default Profile;
