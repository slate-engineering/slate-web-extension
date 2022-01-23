import React, { useState, useEffect } from "react";
import { ModalContext } from "../Contexts/ModalProvider";

import ReactShadowRoot from "react-shadow-root";
import * as Styles from "../Common/styles";

import HomePage from "../Pages/Home";
import ShortcutsPage from "../Pages/Shortcuts";
import AccountPage from "../Pages/Account";

const Modal = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState({ active: "home" });
  const [user, setUser] = useState(null);

  const handleCloseModal = () => {
    window.postMessage({ type: "CLOSE_APP" }, "*");
  };

  useEffect(() => {
    let handleMessage = (event) => {
      if (event.data.type === "AUTH_REQ") {
        setUser(null);
        setLoaded(true);
      }

      if (event.data.run === "OPEN_HOME_PAGE") {
        setPage({ active: "home" });
      }

      if (event.data.run === "OPEN_SHORTCUTS_PAGE") {
        setPage({ active: "shortcuts" });
      }

      if (event.data.run === "OPEN_ACCOUNT_PAGE") {
        setPage({ active: "account" });
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
    <ModalContext.Consumer>
      {({ pageData }) => (
        <>
          <ReactShadowRoot>
            <style>{Styles.main}</style>
            <div id="modal" className="modalWindow">
              <div className="modalContent">
                {page.active === "home" && (
                  <HomePage
                    pageData={pageData}
                    image={props.image}
                    favicon={props.favicon}
                    status={props.link}
                    user={user}
                    loaded={loaded}
                  />
                )}

                {page.active === "shortcuts" && (
                  <ShortcutsPage user={user} loaded={loaded} />
                )}

                {page.active === "account" && (
                  <AccountPage user={user} loaded={loaded} />
                )}
              </div>
            </div>

            <div className="modalBackground" onClick={handleCloseModal}></div>
          </ReactShadowRoot>
        </>
      )}
    </ModalContext.Consumer>
  );
};

export default Modal;
