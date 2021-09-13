import React, { useState } from 'react';
import Image from '../Components/Image';
import * as Icons from '../Components/Icons';
import Button from '../Components/Button';
import Metadata from '../Components/Metadata';
import Header from '../Components/Header';
import classes from '../App.module.css';
require('typeface-inter');

const ShortcutsPage = (props) => {

	let shortcuts = [
		{ short: '⌥', key: 'S', name: 'Open extension' },
		{ short: '⌥', key: 'B', name: 'Bookmark current page' },
		{ short: '⌥', key: 'A', name: 'Open account options' },
		{ short: '', key: 'esc', name: 'Close extension' },
		{ short: '⌥', key: 'O', name: 'Open web app' },
	]

	return(
		<>
			<Header
				title="Shortcuts"
				goBack={true}
			/>	

			<div className={classes.modalTableHeader}>
				<div style={{ marginLeft: '72px' }}>Name</div>
				<div style={{ marginLeft: '400px', position: 'absolute' }}>Shortcut</div>
			</div>

			{shortcuts.map((shortcut) => {
				return (
				    <div className={classes.modalTableContent}>
						<div style={{ marginLeft: '72px' }}>{shortcut.name}</div>
						<div style={{ marginLeft: '400px', position: 'absolute' }}>
							{shortcut.short &&
								<span className={classes.modalShortcut}>{shortcut.short}</span> 
							}
							<span className={classes.modalShortcut}>{shortcut.key}</span> 
						</div>
					</div>
				);
			})}
		</>
	);
};

export default ShortcutsPage;