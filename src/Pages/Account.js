import React, { useState } from "react";

import Header from "../Components/Header";
import ProgressBar from "../Components/ProgressBar";

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
						0 Objects{" "}
						<span style={{ marginLeft: "16px" }}>
							0GB of 16GB Stored
						</span>
					</div>

					<ProgressBar progress="70%" />

					{
						//TODO (JASON): create small button comonent
					}
					<div onClick={handleSignOut} className="modalSmallButton">
						Sign out
					</div>
				</div>
			</div>
		</>
	);
};

export default AccountPage;
