import React, { useState } from 'react';
import * as Icons from '../Components/Icons';
import classes from '../App.module.css';

const Button = (props) => {

	let svg;
	if(props.icon == 'tag') {
		svg = <Icons.Tag />
	}else if(props.icon == 'bookmark'){
		svg = <Icons.Bookmark />
	}else if(props.icon == 'plus'){
		svg = <Icons.Plus />
	}else if(props.icon == 'settings'){
		svg = <Icons.Settings />
	}

	const handleClick = (e) => {
		e.preventDefault();
		window.postMessage({ run: props.run, url: props.data.url }, "*");
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
			</div>
		</>
	);
};

export default Button;

