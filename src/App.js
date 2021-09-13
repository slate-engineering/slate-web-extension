import React, { useState, useEffect } from 'react';
import Modal from './Components/Modal';
import Loader from './Components/Loader';
import Screenshot from './Components/Screenshot';
import ModalProvider from './Contexts/ModalProvider';
import Hotkeys from 'react-hot-keys';
import "@fontsource/inter";

function App() {
  const [isOpened, setIsOpened] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isScreenshot, setIsScreenshot] = useState(false);
  const [og, setOg] = useState({ image: null, title: null });

  const [user, setUser] = useState({ signedin: false, data: null });

  function onKeyDown(keyName, e, handle) {
    console.log(keyName)

    if(keyName === 'esc') {
      setIsOpened(false)
    }

    if(keyName === 'alt+b' || keyName === 'enter') {
      window.postMessage({ run: 'OPEN_LOADING', url: window.location.href }, "*");
    }

    if(keyName === 'alt+a') {
      window.postMessage({ run: 'OPEN_ACCOUNT_PAGE' }, "*");
    }

    if(keyName === 'alt+c') {
      window.postMessage({ run: 'OPEN_SHORTCUTS_PAGE' }, "*");
    }
  }

  window.addEventListener("message", function(event) {
    if(event.data.type === "UPLOAD_START") {
      setIsOpened(false)
      setIsUploading(true)
    }

    if(event.data.type === "CLOSE_APP") {
      setIsOpened(false)
    }

    if(event.data.type === "OPEN_LOADING") {
      setIsOpened(false)
      setIsUploading(true)
    }
    if(event.data.type === "OPEN_SCREENSHOT_SHORTCUT") {
      setIsOpened(false)
      setIsScreenshot(true)
    }
  });

  useEffect(() => {
    let meta = getMeta();
    setOg({ image: meta.image, favicon: meta.favicon })
  }, []);

  const getMeta = () => {
    let meta = {};

    if(document.querySelector("meta[property='og:image']")){
      meta.image = document.querySelector("meta[property='og:image']").getAttribute('content');
    } else {
      meta.image = "https://slate.textile.io/ipfs/bafkreidwm3g5q4vm32j42yofeccacjqhpbm2u3j4gq4rnsihg54zsmz6pi"
    }

    if(document.querySelector("link[rel~='icon']")){
      meta.favicon = document.querySelector("link[rel~='icon']").getAttribute('href');
    }

    return meta;
  }

  return (
    <>
      {isOpened &&
        <ModalProvider>
          <div>
            <Hotkeys 
              keyName="esc,alt+b,alt+a,alt+c,alt+3,enter" 
              onKeyDown={onKeyDown.bind(this)}
            >
              <Modal
                image={og.image}
                favicon={og.favicon}
              />
            </Hotkeys>
          </div>
        </ModalProvider>
      }
      {isUploading &&
        <Loader
          image={og.image}
          title={document.title}
        />
      }
      {/*
        isScreenshot &&
        <Screenshot />
      */}
    </>
  );
}

export default App;
