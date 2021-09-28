import React, { useState } from "react";

import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

const Metadata = (props) => {
	let count = 45;
	let title = Strings.truncateString(count, props.data.title);
	return (
		<>
			<div className="metadata">
				<div className="metadataBox">
					{!props.status.uploaded ? (
						<SVG.Link
							width="16px"
							height="16px"
							style={{ marginTop: "8px" }}
						/>
					) : (
						<SVG.CheckCircle
							width="16px"
							height="17px"
							style={{ marginTop: "8px" }}
						/>
					)}
				</div>
				<div className="metadataBox2">
					<div className="metaDataTitle">{title}</div>
					<div style={{ lineHeight: "16px" }}>
						<div className="metadataUrl">
							{Strings.getUrlHost(props.data.url)}
						</div>
					</div>
				</div>

				<div className="metadataBox3">
					<img height="32px" src={props.image} />
				</div>
			</div>
		</>
	);
};

export default Metadata;
