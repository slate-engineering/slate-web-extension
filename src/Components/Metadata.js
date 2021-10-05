import React, { useState } from "react";

import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

const Metadata = (props) => {
	const [avatar, setAvatar] = useState(null);

	let count = 45;
	let title = Strings.truncateString(count, props.data.title);

	const checkImage = (url) => {
		let avatar = new Image();
		avatar.addEventListener("load", () => {
			setAvatar(url);
		});
		avatar.src = url;
	};

	checkImage(props.image);

	return (
		<>
			<div className="metadata">
				<div className="metadataBox">
					{!props.status.uploaded ? (
						<SVG.Link
							width="16px"
							height="16px"
							style={{ marginTop: "12px" }}
						/>
					) : (
						<SVG.CheckCircle
							width="16px"
							height="17px"
							style={{ marginTop: "10px" }}
						/>
					)}
				</div>
				<div className="metadataBox2">
					<div className="metaDataTitle">{title}</div>
					<div style={{ lineHeight: "16px" }} className="metaDataUrl">
						{Strings.getUrlHost(props.data.url)}
					</div>
				</div>

				<div className="metadataBox3">
					<img height="32px" src={avatar} />
				</div>
			</div>
		</>
	);
};

export default Metadata;
