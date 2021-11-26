import React, { useState } from "react";
import * as SVG from "../Common/SVG";

const Header = (props) => {
	const [avatar, setAvatar] = useState(null);

	const handleGoBack = () => {
		window.postMessage({ run: "OPEN_HOME_PAGE" }, "*");
	};

	const checkImage = (url) => {
		let avatar = new Image();
		avatar.addEventListener("load", () => {
			setAvatar(url);
		});
		avatar.src = url;
	};

	if (props.user.loaded) {
		checkImage(props.user.data.data.photo);
	}

	return (
		<div className="modalHeader">
			{props.goBack ? (
				<div className="modalGoBack" onClick={handleGoBack}>
					<SVG.ChevronLeft
						width="16px"
						height="16px"
						style={{
							margin: "auto",
							marginTop: "3px",
							display: "block",
						}}
					/>
				</div>
			) : (
				<>
					{avatar ? (
						<img
							className="modalGoBack"
							width="24px"
							height="24px"
							src={avatar}
							alt={`Avatar`}
						/>
					) : (
						<div className="modalGoBack"></div>
					)}
				</>
			)}

			<p className="modalHeaderTitle">{props.title}</p>
		</div>
	);
};

export default Header;
