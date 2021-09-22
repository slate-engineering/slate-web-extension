import React from "react";

import Metadata from "../Components/Metadata";
import Header from "../Components/Header";

import * as Strings from "../Common/strings";

const ShortcutsPage = (props) => {
	return (
		<>
			<Header title="Shortcuts" goBack={true} />

			<div className="modalTableHeader">
				<div style={{ marginLeft: "72px" }}>Name</div>
				<div style={{ marginLeft: "400px", position: "absolute" }}>
					Shortcut
				</div>
			</div>

			{Strings.shortcuts.map((shortcut) => {
				return (
					<div className="modalTableContent">
						<div style={{ marginLeft: "72px" }}>
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
