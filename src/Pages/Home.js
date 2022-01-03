import React from "react";
import useState from 'react-usestateref'

import Button from "../Components/Button";
import Metadata from "../Components/Metadata";
import Header from "../Components/Header";
import { LoadingSpinner } from "../Components/Loaders";

import Hotkeys from "react-hot-keys";

const HomePage = (props) => {

	const [highlightButton, setHighlightButton, highlightButtonRef] = useState(1);
	const [onEnter, setOnEnter, onEnterRef] = useState(false);


	const handleOpenAuth = () => {
		window.open("https://slate.host/_/auth", "_blank").focus();
		window.postMessage({ run: 'CHECK_LOGIN' }, "*");
	};

	const handleButtonChange = (id) => {
		setHighlightButton(id)
	}

	async function onKeyDown(keyName, e, handle) {
		if (keyName === 'up') {
			let highlight;
			if(highlightButtonRef.current === 1) {
				return;
			} else {
				highlight = highlightButtonRef.current - 1;
				setHighlightButton(highlight)
			}
			return;
		}

		if (keyName === 'down') {
			let highlight;
			if(highlightButtonRef.current === 3) {
				return;
			} else {
				highlight = highlightButtonRef.current + 1;
				setHighlightButton(highlight)
			}	
			return;
		}

		if (keyName === 'enter') {
			console.log('enter on : ', highlightButtonRef.current)
			setOnEnter(true)
		}
	}

	//console.log(highlightButtonRef.current)

	let notLoggedIn = { loaded: false }

	return (
		<>			
			{!props.user.loaded ? (
				<LoadingSpinner loader={props.loader} />
			) : (
				<>
					{props.user.data ? (
						<>
							<Hotkeys
				              keyName="down,up,left,right,enter"
				              onKeyDown={onKeyDown.bind(this)}
				            >
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
											id={1}
											text="Add to my library"
											shortcut="enter"
											command="⏎"
											icon="plus"
											run="SAVE_LINK"
											data={props.pageData}
											highlight={highlightButton}
											onChange={handleButtonChange}
											onEnter={onEnterRef.current}
										/>
									) : (
										<Button
											id={1}
											text="View on Slate"
											shortcut="enter"
											command="⏎"
											icon="eye"
											run="OPEN_LINK"
											data={props.status}
											highlight={highlightButton}
											onChange={handleButtonChange}
											onEnter={onEnterRef.current}
										/>
									)}

									<p className="modalSystemText">System</p>

									<Button
										id={2}
										text="Shortcuts"
										icon="command"
										run="OPEN_SHORTCUTS_PAGE"
										highlight={highlightButton}
										onChange={handleButtonChange}
										onEnter={onEnterRef.current}
									/>

									<Button
										id={3}
										text="Account"
										icon="account"
										run="OPEN_ACCOUNT_PAGE"
										data={props.pageData}
										highlight={highlightButton}
										onChange={handleButtonChange}
										onEnter={onEnterRef.current}
									/>
								{/*
								<Button
									text="Uploads"
									shortcut="3"
									command="option"
									icon="uploads"
								/>
								*/}
								</div>
							</Hotkeys>
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
										bottom: "16px",
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
