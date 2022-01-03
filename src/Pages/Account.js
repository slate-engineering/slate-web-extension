import React, { useState } from "react";

import Header from "../Components/Header";
import ProgressBar from "../Components/ProgressBar";
import Hotkeys from "react-hot-keys";

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

	async function onKeyDown(keyName, e, handle) {
		e.preventDefault();
		if(keyName === 'left') {
			window.postMessage({ run: "OPEN_HOME_PAGE" }, "*");
		}
	}

	checkImage(props.user.data.data.photo);

	return (
		<>
			<Hotkeys
				keyName="left"
				onKeyDown={onKeyDown.bind(this)}
			>
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
							<a className="modalLink" href="https://slate.host/_/data" target="_blank">View profile</a>
						</div>
					</div>
				</div>
			</Hotkeys>
		</>
	);
};

export default AccountPage;
