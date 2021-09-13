import React, { useState } from 'react';
import Image from '../Components/Image';
import * as Icons from '../Components/Icons';
import classes from '../App.module.css';
require('typeface-inter');

const Header = (props) => {

	const handleGoBack = () => {
		window.postMessage({ run: 'OPEN_HOME_PAGE' }, "*");
	}

	return(
		<div className={classes.modalHeader}>
			{props.goBack &&
				<span className={classes.modalGoBack} onClick={handleGoBack}>
					<Icons.ChevronLeft />
				</span>
			}
			<p className={classes.modalHeaderTitle}>{props.title}</p>
		</div>
	);
};

export default Header;