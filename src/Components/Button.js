import React, { useState } from 'react';
import * as Icons from '../Components/Icons';
import classes from '../App.module.css';
require('typeface-inter');

const Button = (props) => {

	console.log('this is a button', props)

	let svg;
	if(props.icon == 'command') {
		svg = <Icons.Command />
	}else if(props.icon == 'bookmark'){
		svg = <Icons.Bookmark />
	}else if(props.icon == 'plus'){
		svg = <Icons.Plus />
	}else if(props.icon == 'account'){
		svg = <Icons.Account />
	}else if(props.icon == 'uploads'){
		svg = <Icons.Uploads />
	}

	const handleClick = (e) => {
		e.preventDefault();
		window.postMessage({ run: props.run }, "*");
		/*
		if(props.data.url) {
			window.postMessage({ run: props.run, url: props.data.url }, "*");
			return;
		}
		*/
	}

	return(
		<>
			<div
				onClick={handleClick}
				className={classes.modalButtonMain}
			>
				<div className={classes.modalButtonSVG}>
					{svg}
				</div>
				<div className={classes.modalButtonText}>
					{props.text}
				</div>
				<div style={{ position: 'absolute', right: '32px', color: '#8E9093', fontSize: '14px' }}>
					{props.command &&
						<span className={classes.modalCommandIcon}>⌥</span> 
					}
					<span className={classes.modalKeyIcon}>{props.shortcut}</span>
				</div>
			</div>
		</>
	);
};

export default Button;

