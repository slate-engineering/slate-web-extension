import React from "react";

import Header from "../Components/Header";

import * as Strings from "../Common/strings";

const ShortcutsPage = (props) => {
	return (
		<>
			<Header title="Shortcuts" goBack={true} user={props.user} />

			<div className="modalTableHeader">
				<div style={{ marginLeft: "56px" }}>Name</div>
				<div style={{ marginLeft: "400px", position: "absolute" }}>
					Shortcut
				</div>
			</div>

			{Strings.shortcuts.map((shortcut) => {
				return (
					<div className="modalTableContent">
						<div style={{ marginLeft: "56px" }}>
							{shortcut.name}
						</div>
						<div
							style={{
								marginLeft: "400px",
								position: "absolute",
							}}
						>
							{shortcut.short && (
								<span className="modalShortcut">
									{shortcut.short}
								</span>
							)}
							<span className="modalShortcut">
								{shortcut.key}
							</span>
						</div>
					</div>
				);
			})}
		</>
	);
};

export default ShortcutsPage;
