import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";

const UploadImage = () => {
	const [file, setFile] = useState();
	const { instance, accounts, inProgress } = useMsal();

	const uploadImage = async (file) => {
		const tokenResponse = await instance.acquireTokenSilent({
			scopes: [`api://add80d4e-e2b7-4e51-815f-2617074979f6/user_impersonation`],
			account: accounts[0],
		});

		{
			console.log("file", file);
		}
		{
			console.log("file", file.type);
		}

		let res = await fetch("http://localhost:7071/api/uploadimage", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${tokenResponse.accessToken}`,
				"Content-Type": file.type,
			},
			body: file,
		});

		console.log(res);
	};

	return (
		<div>
			{console.log("acc", accounts, instance)}
			{console.log("file", accounts, instance)}

			<input type="file" onChange={(e) => setFile(e.target.files[0])} />
			{file && (
				<button onClick={() => uploadImage(file)}>Upload profile image</button>
			)}
		</div>
	);
};

export default UploadImage;
