import React, { useState } from 'react';
import Image from '../Components/Image';
import * as Icons from '../Components/Icons';
import classes from '../App.module.css';
require('typeface-inter');

const Metadata = (props) => {

	let count = 45;
	let title = props.data.title.slice(0, count) + (props.data.title.length > count ? "..." : "");

	const getHostname = (url) => {
	  return new URL(url).hostname;
	}

    const handleCloseModal = () => {
		window.postMessage({ type: "CLOSE_APP" }, "*");
    }

	return(
		<>
			<div className={classes.metadata}>
				<div className={classes.metadataBox}>
					<Icons.Link />
					{/*
					<Image 
					  url={props.image}
					  width="24px"
					  height="24px" 
					/>
					*/}
				</div>
	            <div className={classes.metadataBox2}>
					<div className={classes.metaDataTitle}>{title}</div>
					<div style={{ lineHeight: '16px' }}>
						<div className={classes.metadataUrl}>
							{getHostname(props.data.url)}
						</div>
					</div>
				</div>

				<div className={classes.metadataBox3}>
					<img height="32px" src={props.image} />
				</div>
			</div>
		</>
	);
};

export default Metadata;