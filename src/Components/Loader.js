import React, { useState, useEffect } from 'react';
import { HotKeys } from "react-hotkeys";
import { ModalContext } from '../Contexts/ModalProvider';
import Button from '../Components/Button';
import Metadata from '../Components/Metadata';
import Image from '../Components/Image';
import * as Icons from '../Components/Icons';
import Hotkeys from 'react-hot-keys';
import classes from '../App.module.css';

const Loader = (props) => {
  const [visable, setVisable] = useState(true);
  const [upload, setUpload] = useState({ status: 'uploading', data: null, error: false });

  const handleCloseModal = () => {
    setVisable(false)
  }

  window.addEventListener("message", function(event) {
    if(event.data.type === "UPLOAD_DONE") {
      setUpload({ 
        status: 'complete', 
        data: event.data.data.cid 
      }) 
      const timer = setTimeout(() => {
        handleCloseModal()
      }, 10000);
      return () => clearTimeout(timer);
    }

    if(event.data.type === "UPLOAD_FAIL") {
      setUpload({ status: 'error' }) 
    }

    if(event.data.type === "UPLOAD_DUPLICATE") {
      setUpload({ 
        status: 'duplicate', 
        data: event.data.data.cid 
      }) 
    }
  });

  let count = 28;
  let title = props.title.slice(0, count) + (props.title.length > count ? "..." : "");

  const Footer = (props) => {
    let url = ((props.upload.data) ? `https://slate.host/_/data?cid=${props.upload.data}` : null);
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
          <div id="modal" className={classes.loaderWindow }>
            <div className={classes.loaderContent}>
              <div className={classes.loaderText}>
                <img className={classes.loaderImage} src={props.image} />
                {title}
                <div onClick={handleCloseModal} className={classes.loaderClose}>
                  <Icons.Close />
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
