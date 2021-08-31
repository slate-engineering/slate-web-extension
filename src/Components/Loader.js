import React, { useState, useEffect } from 'react';
import { HotKeys } from "react-hotkeys";
import { ModalContext } from '../Contexts/ModalProvider';
import Button from '../Components/Button';
import Metadata from '../Components/Metadata';
import Image from '../Components/Image';
import Hotkeys from 'react-hot-keys';
import classes from '../App.module.css';

const fetch = require('node-fetch');
const og = require('open-graph');

const Loader = (props) => {
  const [visable, setVisable] = useState(true);
  const [upload, setUpload] = useState({ status: 'uploading', data: null, error: false });

  const handleCloseModal = () => {
    setVisable(false)
  }

  const onLoadHover = () => {
    console.log('hovering now')
  }

  const handleKeydown = (e) => {
    console.log('this is the key press event from loader', e)
  }

  window.addEventListener("message", function(event) {
    if(event.data.type === "UPLOAD_DONE") {
      setUpload({ status: 'complete', data: event.data.data.cid }) 
      const timer = setTimeout(() => {
        handleCloseModal()
      }, 10000);
      return () => clearTimeout(timer);
    }

    if(event.data.type === "UPLOAD_FAIL") {
      setUpload({ status: 'error' }) 
    }

    if(event.data.type === "UPLOAD_DUPLICATE") {
      setUpload({ status: 'duplicate', data: event.data.data.cid }) 
    }
  });

  let count = 28;
  let title = props.title.slice(0, count) + (props.title.length > count ? "..." : "");

  const loaderClose = () => {
    setVisable(false)
  }

  const Footer = (props) => {
    let url;
    if(props.upload.data) {
      url = `https://slate.host/_/data?cid=${props.upload.data}`;
    }
    return (
        <>
          {props.upload.status === 'uploading' &&
            <div className={classes.loaderFooterLeft}>Saving...</div>
          }

          {props.upload.status === 'complete' &&
            <>
              <div className={classes.loaderFooterLeft}>Saved</div>
              <div className={classes.loaderFooterRight}>
                <a href={url} style={{ color: '#0084FF', fontWeight: '600', textDecoration: 'none' }} target="_blank">
                  View
                </a>
              </div>
            </>
          }

          {props.upload.status === 'duplicate' &&
            <>
              <div className={classes.loaderFooterLeft} style={{ color: '#34D159'}}>Already exists</div>
              <div className={classes.loaderFooterRight}>
                <a href={url} style={{ color: '#0084FF', fontWeight: '600', textDecoration: 'none' }} target="_blank">
                  View
                </a>
              </div>
            </>
          }

          {props.upload.status === 'error' &&
            <div className={classes.loaderFooterLeft} style={{ color: '#FF4530' }}>Failed to save</div>
          }

        </>
      )
  }

  return (
    <ModalContext.Consumer>
      {({ windowPosition, hasDraggedWindowPosition, extensionId, getExtensionId, pageData }) => (
        <>
        {visable &&
          <div id="modal" className={classes.loaderWindow } onMouseEnter={onLoadHover}>
            <div className={classes.loaderContent}>
              <div className={classes.loaderText}>
                <img className={classes.loaderImage} src={props.image} />
                {title}
                <div onClick={loaderClose} className={classes.loaderClose}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15" stroke="#48494A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 5L15 15" stroke="#48494A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className={classes.loaderFooter}>
                <Footer upload={upload} />
              </div>
            </div>
          </div>
        }
        </>
      )}
    </ModalContext.Consumer>
  );
};

export default Loader;
