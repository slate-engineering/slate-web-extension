import React from "react";
import * as SVG from "../Common/SVG";

const Header = (props) => {
	const handleGoBack = () => {
		window.postMessage({ run: "OPEN_HOME_PAGE" }, "*");
	};

	return (
		<div className="modalHeader">
			{props.goBack && (
				<div className="modalGoBack" onClick={handleGoBack}>
					<SVG.ChevronLeft width="16px" height="16px" style={{ maginTop: '8px' }} />
				</div>
			)}

			<p className="modalHeaderTitle">{props.title}</p>
		</div>
	);
};

export default Header;
