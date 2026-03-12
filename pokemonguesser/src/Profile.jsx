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

		const imgLink = await fetch(`${BASEURL}/api/imagelink/${image}`);
		let imgLinkData = await imgLink.json();

		console.log("res profile link", imgLinkData);
		setProfileImageSAS(imgLinkData.url);
	};

	useEffect(() => {
		if (username) {
			fetchProfile();
		}
	}, []);

	return (
		<Row className="mx-auto w-75">
			{console.log("SAS", profileImageSAS)}
			<Col xs={2}>
				{" "}
				<Image
					className="w-100 my-5 "
					src={
						profileImageSAS ? profileImageSAS : "https://placehold.co/100x100"
					}
					roundedCircle
				/>
				<h5>Upload new profile picture</h5>
				<UploadImage />
			</Col>
			<Col xs={6}>
				<h3>Welcome, {username}</h3>
			</Col>
		</Row>
	);
};

export default Profile;
