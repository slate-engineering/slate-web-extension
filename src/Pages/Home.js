import React from "react";

import Button from "../Components/Button";
import Metadata from "../Components/Metadata";
import Header from "../Components/Header";

const HomePage = (props) => {
	return (
		<>
			<Header title="Slate Web Extension" />

			<Metadata
				data={props.pageData}
				image={props.image}
				favicon={props.favicon}
				status={props.status}
			/>

			<div style={{ paddingTop: "8px" }}>

				{!props.status.uploaded ?
					<Button
						text="Add to my library"
						shortcut="enter"
						icon="plus"
						run="SAVE_LINK"
						data={props.pageData}
					/>
				:
					<Button
						text="View on Slate"
						shortcut="enter"
						icon="eye"
						run="OPEN_LINK"
						data={props.status}
					/>
				}

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
	);
};

export default HomePage;
