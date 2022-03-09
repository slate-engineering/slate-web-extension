import React, { useState, useEffect } from "react";
import * as Styles from "../Common/styles";

import HomePage from "../Pages/Home";
import ShortcutsPage from "../Pages/Shortcuts";
import AccountPage from "../Pages/Account";
import Hotkeys from "react-hot-keys";

import { useModalContext } from "../Contexts/ModalProvider";

const Modal = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);

  const {
    isHomeActive,
    isAccountActive,
    isShortcutsActive,

    navigateToAccount,
    navigateToShortcuts,
    closeModal,

    pageData,
  } = useModalContext();

  function onKeyDown(keyName) {
    if (keyName === "esc") closeModal();

    if (keyName === "alt+a") navigateToAccount();

    if (keyName === "alt+c") navigateToShortcuts();
  }

  //Disable Up Down arrows in the main window to prevent page scrolls
  const onKeyDownMain = (e) => {
    if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDownMain);
    return () => window.removeEventListener("keydown", onKeyDownMain);
  }, []);

  useEffect(() => {
    let handleMessage = (event) => {
      if (event.data.type === "AUTH_REQ") {
        setUser(null);
        setLoaded(true);
      }

      if (event.data.type === "CHECK_LINK") {
        setUser(event.data.user);
        setLoaded(true);
        /*
        if (event.data.data.decorator === "LINK_FOUND") {
          setCheckLink({ uploaded: true, data: event.data.data });
        }
        */
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <Hotkeys
      keyName="esc,alt+b,alt+a,alt+c,alt+3"
      onKeyDown={onKeyDown.bind(this)}
    >
      <>
        <style>{Styles.main}</style>
        <div id="modal" className="modalWindow">
          <div className="modalContent">
            {isHomeActive && (
              <HomePage
                pageData={pageData}
                image={props.image}
                favicon={props.favicon}
                status={props.link}
                user={user}
                loaded={loaded}
              />
            )}

            {isShortcutsActive && <ShortcutsPage user={user} loaded={loaded} />}

            {isAccountActive && <AccountPage user={user} loaded={loaded} />}
          </div>
        </div>

        <div className="modalBackground" onClick={closeModal}></div>
      </>
    </Hotkeys>
  );
};

export default Modal;
