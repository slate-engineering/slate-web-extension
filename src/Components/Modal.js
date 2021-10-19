import React, { useState, useEffect } from "react";
import { ModalContext } from "../Contexts/ModalProvider";

import ReactShadowRoot from "react-shadow-root";
import * as Styles from "../Common/styles";

import HomePage from "../Pages/Home";
import ShortcutsPage from "../Pages/Shortcuts";
import AccountPage from "../Pages/Account";

const Modal = (props) => {
  //const [search, setSearch] = useState({ query: null });
  //const [tags, setTags] = useState({ show: false });
  const [loading, setLoading] = useState({ mini: false });
  const [og, setOg] = useState({ image: null, title: null });
  const [page, setPage] = useState({ active: "home" });
  const [user, setUser] = useState({ loaded: false, data: null });

  useEffect(() => {
    let loaderType = document.getElementById("slate-loader-type")
    if(loaderType) {
      loaderType.getAttribute('data-type');
      console.log('loaderType from modal: ', loaderType);
      setLoading({ mini: true })
    }
  }, []);

  const handleCloseModal = () => {
    window.postMessage({ type: "CLOSE_APP" }, "*");
  };

  window.addEventListener("message", function (event) {
    /*
    if(event.data.type === "LOAD_APP_WITH_TAGS") {
      setTags({ show: true })
    }
    */

    if (event.data.type === "AUTH_REQ") {
      setUser({ loaded: true, data: null });
      setLoading({ mini: false })
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
      setUser({ loaded: true, data: event.data.user });
      setLoading({ mini: false })
      /*
      if (event.data.data.decorator === "LINK_FOUND") {
        setCheckLink({ uploaded: true, data: event.data.data });
      }
      */
    }
  });

  return (
    <ModalContext.Consumer>
      {({ pageData }) => (
        <>
          <ReactShadowRoot>
            <style>{Styles.main}</style>
            <div id="modal" className="modalWindow" style={loading.mini ? { width:'50px', height: '50px' } : {}}>
              <div className="modalContent">
                {page.active === "home" && (
                  <HomePage
                    pageData={pageData}
                    image={props.image}
                    favicon={props.favicon}
                    status={props.link}
                    loader={loading.mini}
                    user={user}
                  />
                )}

                {page.active === "shortcuts" && <ShortcutsPage user={user} />}

                {page.active === "account" && <AccountPage user={user} />}
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
