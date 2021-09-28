import React from "react";

import Header from "../Components/Header";
import ProgressBar from "../Components/ProgressBar";

const AccountPage = (props) => {

	const handleSignOut = (e) => {
		e.preventDefault();
		window.postMessage({ run: 'SIGN_OUT', type: "CLOSE_APP" }, "*");
	}

	return (
		<>
			<Header title="Account" goBack={true} />

			<div className="modalAccount">
				<div className="modalAccountContent">
					<img
						className="modalAccountAvatar"
						width="64px"
						height="64px"
						src={props.user.data.data.photo}
					/>
					<div className="modalAccountUsername">{props.user.data.data.name}</div>
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
					<div onClick={handleSignOut} className="modalSmallButton">Sign out</div>
				</div>
			</div>
		</>
	);
};

export default AccountPage;
