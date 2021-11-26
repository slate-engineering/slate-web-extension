import React, { useState } from "react";

import Header from "../Components/Header";

const AccountPage = (props) => {
	const [avatar, setAvatar] = useState(null);

	const handleSignOut = (e) => {
		e.preventDefault();
		window.postMessage({ run: "SIGN_OUT", type: "CLOSE_APP" }, "*");
	};

	const checkImage = (url) => {
		let avatar = new Image();
		avatar.addEventListener("load", () => {
			setAvatar(url);
		});
		avatar.src = url;
	};

	checkImage(props.user.data.data.photo);

	return (
		<>
			<Header title="Account" goBack={true} user={props.user} />

			<div className="modalAccount">
				<div className="modalAccountContent">
					{avatar ? (
						<img
							className="modalAccountAvatar"
							width="64px"
							height="64px"
							src={avatar}
							alt={`Avatar`}
						/>
					) : (
						<div
							className="modalAccountAvatarBlank"
							style={{ width: "64px", height: "64px" }}
						></div>
					)}
					<div className="modalAccountUsername">
						{props.user.data.data.name}
					</div>

					<div className="modalAccountStorage">
						<a 
							className="modalLink" 
							href="https://slate.host/_/data" 
							target="_blank"
						>
							View profile
						</a>
					</div>

					<div onClick={handleSignOut} className="modalSmallButton">
						Sign out {props.user.data.data.name}
					</div>
					
				</div>
			</div>
		</>
	);
};

export default AccountPage;
