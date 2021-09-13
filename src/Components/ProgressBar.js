import React from 'react';
import classes from '../App.module.css';

const ProgressBar = (props) => {

	return(
		<div className={classes.modalProgressContainer}>
			<div className={classes.modalProgressBar} style={{ width: props.progress }}></div>
		</div>
	);
};

export default ProgressBar;