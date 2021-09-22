import React from "react";
import * as SVG from "../Common/SVG";

const Button = (props) => {

	const icons = {
		command: <SVG.MacCommand width="16px" height="16px" style={{ marginTop: '16px', display: 'flex' }} />,
		plus: <SVG.Plus width="20px" height="20px" style={{ marginTop: '12px' }} />,
		account: <SVG.Account width="20px" height="20px" style={{ marginTop: '14px' }} />,
		uploads: <SVG.Upload width="16px" height="16px" />,
		eye: <SVG.Eye width="16px" height="16px" />,
	}
	let svg = icons[props.icon];

	const handleClick = (e) => {
		e.preventDefault();
		window.postMessage({ run: props.run }, "*");
	};

	return (
		<>
			<div onClick={handleClick} className="modalButtonMain">
				<div className="modalButtonSVG">{svg}</div>
				<div className="modalButtonText">{props.text}</div>
				<div
					style={{
						position: "absolute",
						right: "32px",
						color: "#8E9093",
						fontSize: "14px",
					}}
				>
					{props.command && (
						<span className="modalCommandIcon">⌥</span>
					)}
					<span className="modalKeyIcon">
						{props.shortcut}
					</span>
				</div>
			</div>
		</>
	);
};

export default Button;
