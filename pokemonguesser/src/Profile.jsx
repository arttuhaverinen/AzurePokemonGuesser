import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import UploadImage from "./UploadImage";

const Profile = () => {
	const location = useLocation();
	const { username } = location.state || {}; // fallback in case state is undefined

	return (
		<Row className="mx-auto w-75">
			<h3>Welcome, {username}</h3>
			<UploadImage />
		</Row>
	);
};

export default Profile;
