import React, { useState } from 'react';
import Image from '../Components/Image';
import classes from '../App.module.css';

const Metadata = (props) => {

	let count = 25;
	let title = props.title.slice(0, count) + (props.title.length > count ? "..." : "");

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
					<Image 
					  url={props.image}
					  width="48px"
					  height="48px" 
					/>
				</div>
	            <div className={classes.metadataBox2}>
					<div className={classes.metaDataTitle}>{title}
						<div style={{ position: 'absolute', display: 'inline', right: '24px', cursor: 'pointer' }} onClick={handleCloseModal}>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15 5L5 15" stroke="#48494A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M5 5L15 15" stroke="#48494A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
					</div>

					<div style={{ display: 'flex', lineHeight: '12px' }}>
						<img src={props.favicon} width="14px" height="14px" style={{ display: 'inline', marginRight: '8px' }} /><div className={classes.metadataUrl}>{getHostname(props.url)}</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Metadata;