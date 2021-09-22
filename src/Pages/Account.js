import React from "react";

import Header from "../Components/Header";
import ProgressBar from "../Components/ProgressBar";

const AccountPage = (props) => {
	return (
		<>
			<Header title="Account" goBack={true} />

			<div className="modalAccount">
				<div className="modalAccountContent">
					<img
						width="64px"
						height="64px"
						src="https://slate.textile.io/ipfs/bafkreidtaj27vkxi2jgfhlshjobcnw2ixv7gl3qkulymaqg4vwcmtpb6me"
						style={{
							borderRadius: "20px",
							display: "block",
							marginLeft: "auto",
							marginRight: "auto",
							justifyContent: "center",
							alignItems: "center",
							clear: "both",
						}}
					/>
					<div className="modalAccountUsername">Username</div>
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
					<div className="modalSmallButton">Sign out</div>
				</div>
			</div>
		</>
	);
};

export default AccountPage;
