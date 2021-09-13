import React, { useState } from 'react';
import Image from '../Components/Image';
import * as Icons from '../Components/Icons';
import Button from '../Components/Button';
import Metadata from '../Components/Metadata';
import Header from '../Components/Header';
import classes from '../App.module.css';
require('typeface-inter');

const HomePage = (props) => {

	const handleCloseModal = () => {
		window.postMessage({ type: "CLOSE_APP" }, "*");
	}

	return(
		<>
			<Header
				title="Slate Web Extension"
			/>

			<Metadata
				data={props.pageData} 
				image={props.image} 
				favicon={props.favicon}
			/>

			<div style={{ paddingTop: '8px' }}>
				<Button 
				  text="Add to my library"
				  shortcut="enter"
				  icon="plus"
				  run="SAVE_LINK"
				  data={props.pageData}
				/>

				<p className={classes.modalSystemText}>
					System
				</p>

				<Button 
				  text="Shortcuts"
				  shortcut="C"
				  command="option"
				  icon="command"
				  run="OPEN_SHORTCUTS_PAGE"
				/>

				<Button 
				  text="Account"
				  shortcut="A"
				  command="option"
				  icon="account"
				  run="OPEN_ACCOUNT_PAGE"
				  data={props.pageData}
				/> 

				<Button 
				  text="Uploads"
				  shortcut="3"
				  command="option"
				  icon="uploads"
				/> 
			</div> 
		</>
	);
};

export default HomePage;