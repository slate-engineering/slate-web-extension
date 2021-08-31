import React, { useState, useEffect } from 'react';
import { X } from 'react-feather';
import Draggable from 'react-draggable';
import { HotKeys } from "react-hotkeys";
import { ModalContext } from '../Contexts/ModalProvider';
import Button from '../Components/Button';
import Metadata from '../Components/Metadata';
import Image from '../Components/Image';
import Search from '../Components/Search';
import Hotkeys from 'react-hot-keys';
import classes from '../App.module.css';

function onKeyUp(keyName, e, handle) {
  console.log("test:onKeyUp", e, handle)
}
function onKeyDown(keyName, e, handle) {
  console.log("test:onKeyDown", keyName, e, handle)
}

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

  /*
  useEffect(() => {
    setDocumentData({
      title: document.title,
      description: document.description,
      url: window.location.href
    })
  });
  

  function getLocalData() {
    setDocumentData({ 
      title: document.title,
      description: document.description,
      url: window.location.href
    });
  }

  getLocalData();
  

  const handleSearchChange = async (e) => {
    let checkType = e.target.value.includes("†")
    if(checkType) {
      let final = e.target.value.replace("†", "type:");
      setSearch({ query: final });
      return;
    }

    let checkFrom = e.target.value.includes("ƒ")
    if(checkFrom) {
      let final = e.target.value.replace("ƒ", "from:");
      setSearch({ query: final });
      return;
    }

    setSearch({ query: e.target.value });
  }

  const handleSearch = (e) => {
    console.log('event: ', e)
    if(e.key === "Enter") {
      window.postMessage({ 
        type: "OPEN_SEARCH", 
        query: e.target.value 
      }, "*");
    }

    if(e.key === "Escape") {
      window.postMessage({ 
        type: "CLOSE_APP", 
      }, "*");
    }

    if(e.key === "Escape") {
      window.postMessage({ 
        type: "CLOSE_APP", 
      }, "*");
    }
  }
  */


  const handleCloseModal = () => {
    window.postMessage({ type: "CLOSE_APP" }, "*");
  }

  const onKeyPressed = (e) => {
    console.log(e.key);
  }

  window.addEventListener("message", function(event) {
    console.log('yes an event was called in the modal', event);

    if(event.data.type === "LOAD_APP_WITH_TAGS") {
      setTags({ show: true })
    }
  });

  console.log('the tag state: ', tags)

  return (
    <ModalContext.Consumer>
      {({ windowPosition, hasDraggedWindowPosition, extensionId, getExtensionId, pageData }) => (
      <>
        <div id="modal"  className={classes.modalWindow}>
          <div className={classes.modalBody}>
            <div className={classes.modalContent}>
              <div className={classes.modalSearchBar}>
                {/*
                <Search />
                */}
              </div>

              <Metadata 
                url={documentData.url} 
                title={documentData.title} 
                image={props.image} 
                favicon={props.favicon}
              />

              <div 
                style={{ margin: '0 auto', overflow: "auto", width: '352px', height: "142px", borderRadius: '12px'}}
                className={classes.modalButtonBox}
              >
                {/*
                <Button 
                  text="Take a Screenshot"
                  shortcut="Option A"
                  icon="tag"
                  run="OPEN_SCREENSHOT"
                  data={pageData}
                />
                */}

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
