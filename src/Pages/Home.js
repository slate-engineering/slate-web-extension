import * as React from "react";
import * as UploadUtilities from "../Utilities/upload";
import * as Constants from "Common/constants";
import * as Strings from "../Common/strings";

import useState from "react-usestateref";
import Button from "../Components/Button";
import Metadata from "../Components/Metadata";
import Header from "../Components/Header";
import Hotkeys from "react-hot-keys";

import { LoadingSpinner } from "../Components/Loaders";
import { useModalContext } from "../Contexts/ModalProvider";

const HomePage = (props) => {
  const [highlightButton, setHighlightButton, highlightButtonRef] = useState(1);
  const [onEnter, setOnEnter, onEnterRef] = useState(false);

  const { closeModal, navigateToAccount, navigateToShortcuts } =
    useModalContext();

  const handleOpenAuth = () => {
    window.open(`${Constants.uri.hostname}/_/auth`, "_blank").focus();
    window.postMessage({ run: "CHECK_LOGIN" }, "*");
  };

  const handleButtonChange = (id) => {
    setHighlightButton(id);
  };

  const handleOpenLink = () => {
    let url = Strings.getSlateFileLink(props.status.data.data.id);
    window.open(url, "_blank");
    return;
  };

  async function onKeyDown(keyName, e, handle) {
    if (keyName === "up") {
      let highlight;
      if (highlightButtonRef.current === 1) {
        return;
      } else {
        highlight = highlightButtonRef.current - 1;
        setHighlightButton(highlight);
      }
      return;
    }

    if (keyName === "down") {
      let highlight;
      if (highlightButtonRef.current === 3) {
        return;
      } else {
        highlight = highlightButtonRef.current + 1;
        setHighlightButton(highlight);
      }
      return;
    }

    if (keyName === "enter") {
      setOnEnter(true);
    }
  }

  return (
    <>
      {!props.loaded ? (
        <LoadingSpinner />
      ) : (
        <>
          {props.user ? (
            <>
              <Hotkeys
                keyName="down,up,left,right,enter"
                onKeyDown={onKeyDown.bind(this)}
              >
                <Header title="Slate Web Extension" user={props.user} />

                <Metadata
                  data={props.pageData}
                  image={props.image}
                  favicon={props.favicon}
                  status={props.status}
                />

                <div style={{ paddingTop: "8px" }}>
                  {!props.status.uploaded ? (
                    <Button
                      id={1}
                      text="Add to my library"
                      shortcut="enter"
                      command="⏎"
                      icon="plus"
                      onClick={() => (
                        UploadUtilities.sendSaveLinkRequest(), closeModal()
                      )}
                      data={props.pageData}
                      highlight={highlightButton}
                      onChange={handleButtonChange}
                      onEnter={onEnterRef.current}
                    />
                  ) : (
                    <Button
                      id={1}
                      text="View on Slate"
                      shortcut="enter"
                      command="⏎"
                      icon="eye"
                      onClick={handleOpenLink}
                      highlight={highlightButton}
                      onChange={handleButtonChange}
                      onEnter={onEnterRef.current}
                    />
                  )}

                  <p className="modalSystemText">System</p>

                  <Button
                    id={2}
                    text="Shortcuts"
                    icon="command"
                    onClick={navigateToShortcuts}
                    highlight={highlightButton}
                    onChange={handleButtonChange}
                    onEnter={onEnterRef.current}
                  />

                  <Button
                    id={3}
                    text="Account"
                    icon="account"
                    data={props.pageData}
                    onClick={navigateToAccount}
                    highlight={highlightButton}
                    onChange={handleButtonChange}
                    onEnter={onEnterRef.current}
                  />
                  {/*
								<Button
									text="Uploads"
									shortcut="3"
									command="option"
									icon="uploads"
								/>
								*/}
                </div>
              </Hotkeys>
            </>
          ) : (
            <>
              <Header title="Slate Web Extension" user={props.user} />

              <div>
                <p className="loginHeader">Welcome to Slate for Chrome</p>
                <p className="loginSubtitle">
                  Your personal search engine for the web.
                </p>

                <div
                  onClick={handleOpenAuth}
                  className="primaryButton"
                  style={{
                    bottom: "16px",
                    right: "16px",
                    position: "absolute",
                  }}
                >
                  Sign in
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
