import React, { useState } from 'react';
import Image from '../Components/Image';
import * as Icons from '../Components/Icons';
import classes from '../App.module.css';

const Metadata = (props) => {

	let count = 25;
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
					<Image 
					  url={props.image}
					  width="48px"
					  height="48px" 
					/>
				</div>
	            <div className={classes.metadataBox2}>
					<div className={classes.metaDataTitle}>{title}
						<div className={classes.metadataCloseIcon} onClick={handleCloseModal}>
							<Icons.Close />
						</div>
					</div>

					<div style={{ display: 'flex', lineHeight: '12px' }}>
						<img src={props.favicon} width="14px" height="14px" style={{ display: 'inline', marginRight: '8px' }} />
						<div className={classes.metadataUrl}>
							{getHostname(props.data.url)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Metadata;