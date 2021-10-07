import React from "react";

import Button from "../Components/Button";
import Metadata from "../Components/Metadata";
import Header from "../Components/Header";
import Loaders from "../Components/Loaders";

const HomePage = (props) => {
	const handleOpenAuth = () => {
		window.open("https://slate.host/_/auth", "_blank").focus();
		window.postMessage({ run: 'CHECK_LOGIN' }, "*");
	};

	let notLoggedIn = { loaded: false }

	return (
		<>
			{!props.user.loaded ? (
				<Loaders />
			) : (
				<>
					{props.user.data ? (
						<>
							<Header title="Slate Web Extension" user={props.user} />

							<Metadata
								data={props.pageData}
								image={props.image}
								favicon={props.favicon}
								status={props.status}
							/>

							<div style={{ paddingTop: "8px" }}>
								{!props.status.uploaded ? (
									<Button
										text="Add to my library"
										shortcut="enter"
										icon="plus"
										run="SAVE_LINK"
										data={props.pageData}
									/>
								) : (
									<Button
										text="View on Slate"
										shortcut="enter"
										icon="eye"
										run="OPEN_LINK"
										data={props.status}
									/>
								)}

								<p className="modalSystemText">System</p>

								<Button
									text="Shortcuts"
									shortcut="C"
									command="option"
									icon="command"
									run="OPEN_SHORTCUTS_PAGE"
								/>

								<Button
									text="Account"
									shortcut="A"
									command="option"
									icon="account"
									run="OPEN_ACCOUNT_PAGE"
									data={props.pageData}
								/>

								<Button
									text="Uploads"
									shortcut="3"
									command="option"
									icon="uploads"
								/>
							</div>
						</>
					) : (
						<>
							<Header title="Slate Web Extension" user={notLoggedIn} />
							
							<div>
								<p className="loginHeader">
									Welcome to Slate for Chrome
								</p>
								<p className="loginSubtitle">
									Your personal search engine for the web.
								</p>

								<div
									onClick={handleOpenAuth}
									className="primaryButton"
									style={{
										bottom: "8px",
										right: "16px",
										position: "absolute",
									}}
								>
									Sign in
								</div>
							</div>
						</>
					)}
				</>
			)}
		</>
	);
};

export default HomePage;
