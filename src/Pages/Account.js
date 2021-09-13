import React, { useState } from 'react';
import Image from '../Components/Image';
import * as Icons from '../Components/Icons';
import Button from '../Components/Button';
import Metadata from '../Components/Metadata';
import Header from '../Components/Header';
import ProgressBar from '../Components/ProgressBar';
import classes from '../App.module.css';
require('typeface-inter');

const AccountPage = (props) => {

	return(
		<>
			<Header
				title="Account"
				goBack={true}
			/>
			
			<div className={classes.modalAccount}>
				<div className={classes.modalAccountContent}>
					<img width="64px" height="64px" src="https://slate.textile.io/ipfs/bafkreidtaj27vkxi2jgfhlshjobcnw2ixv7gl3qkulymaqg4vwcmtpb6me" style={{ borderRadius: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', alignItems: 'center', clear: 'both' }} />
					<div className={classes.modalAccountUsername}>Username</div>
					<div className={classes.modalAccountStorage}>
						0 Objects <span style={{ marginLeft: '16px' }}>0GB of 16GB Stored</span>
					</div>
					
					<ProgressBar 
						progress='70%'
					/>

					{
						//TODO (JASON): create small button comonent
					}
					<div className={classes.modalSmallButton}>
						Sign out
					</div>	

				</div>			

			</div>

		</>
	);
};

export default AccountPage;