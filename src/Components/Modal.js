import React, { useState, useEffect } from 'react';
import { ModalContext } from '../Contexts/ModalProvider';
import Button from '../Components/Button';
import Metadata from '../Components/Metadata';
import classes from '../App.module.css';

const Modal = (props) => {
  const [search, setSearch] = useState({ query: null });
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState({ show: false });
  const [og, setOg] = useState({ image: null, title: null });

  const [documentData, setDocumentData] = useState({ 
    title: document.title,
    description: document.description,
    url: window.location.href
  });

  const handleCloseModal = () => {
    window.postMessage({ type: "CLOSE_APP" }, "*");
  }

  const onKeyPressed = (e) => {
    console.log(e.key);
  }

  window.addEventListener("message", function(event) {
    if(event.data.type === "LOAD_APP_WITH_TAGS") {
      setTags({ show: true })
    }
  });

  return (
    <ModalContext.Consumer>
      {({ windowPosition, hasDraggedWindowPosition, extensionId, getExtensionId, pageData }) => (
      <>
        <div id="modal" className={classes.modalWindow}>
          <div className={classes.modalBody}>
            <div className={classes.modalContent}>
              {/*
                <div className={classes.modalSearchBar}>
                  <Search />
                </div>
              */}
              <Metadata 
                url={documentData.url} 
                title={documentData.title} 
                image={props.image} 
                favicon={props.favicon}
              />

              <div className={classes.modalButtonBox}>
                <Button 
                  text="Bookmark current page"
                  shortcut="Option B"
                  icon="bookmark"
                  run="SAVE_LINK"
                  data={pageData}
                />

                <Button 
                  text="Add channel tags"
                  shortcut="Option C"
                  icon="tag"
                />

                <Button 
                  text="Settings"
                  shortcut="Option C"
                  icon="settings"
                  run="OPEN_SETTINGS"
                  data={pageData}
                />                 
              </div>
              {/*tags.show ? (
                <h2>Show tags now</h2>
              ) : (
                <h2>Dont show tags</h2>
              )*/}
            </div>
          </div>
        </div>
        <div 
          className={classes.modalBackground}
          onClick={handleCloseModal}
        ></div>
      </>
      )}
    </ModalContext.Consumer>
  );
};

export default Modal;
