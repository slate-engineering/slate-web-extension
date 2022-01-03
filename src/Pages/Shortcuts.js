import React from "react";

import Metadata from "../Components/Metadata";
import Header from "../Components/Header";
import Hotkeys from "react-hot-keys";

import * as Strings from "../Common/strings";

const ShortcutsPage = (props) => {

	async function onKeyDown(keyName, e, handle) {
		e.preventDefault();
		if(keyName === 'left') {
			window.postMessage({ run: "OPEN_HOME_PAGE" }, "*");
		}
	}

	return (
		<>
			<Hotkeys
				keyName="left"
				onKeyDown={onKeyDown.bind(this)}
			>
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
								{shortcut.extra &&
									<span className="modalShortcut">
										{shortcut.extra}
									</span>
								}
							</div>
						</div>
					);
				})}
			</Hotkeys>
		</>
	);
};

export default ShortcutsPage;
