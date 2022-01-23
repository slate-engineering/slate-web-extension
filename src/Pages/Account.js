import React, { useState } from "react";

import Header from "../Components/Header";
import ProgressBar from "../Components/ProgressBar";
import Hotkeys from "react-hot-keys";

const AccountPage = (props) => {
  let avatar = props.user.data.photo;
  // const [avatar, setAvatar] = useState(null);

  const handleSignOut = (e) => {
    e.preventDefault();
    window.postMessage({ run: "SIGN_OUT", type: "CLOSE_APP" }, "*");
  };

  // const checkImage = (url) => {
  // 	let avatar = new Image();
  // 	avatar.addEventListener("load", () => {
  // 		setAvatar(url);
  // 	});
  // 	avatar.src = url;
  // };

  async function onKeyDown(keyName, e, handle) {
    e.preventDefault();
    if (keyName === "left") {
      window.postMessage({ run: "OPEN_HOME_PAGE" }, "*");
    }
  }

  // checkImage(props.user.data.data.photo);
  if (!avatar) {
    let colors = ["A9B9C1", "5B6B74", "3C444A", "D4DBDF", "293137"];
    avatar = `https://source.boringavatars.com/marble/24px/${props.user.id}?square&colors=${colors}`;
  }

  return (
    <>
      <Hotkeys keyName="left" onKeyDown={onKeyDown.bind(this)}>
        <Header title="Account" goBack={true} user={props.user} />
        <div className="modalAccount">
          <div className="modalAccountContent">
            {avatar ? (
              <img
                className="modalAccountAvatar"
                width="64px"
                height="64px"
                src={avatar}
              />
            ) : (
              <div
                className="modalAccountAvatarBlank"
                style={{ width: "64px", height: "64px" }}
              ></div>
            )}
            <div className="modalAccountUsername">{props.user.data.name}</div>

            <div className="modalAccountStorage">
              <a
                className="modalLink"
                href="https://slate.host/_/data"
                target="_blank"
              >
                View profile
              </a>
            </div>
          </div>
        </div>
      </Hotkeys>
    </>
  );
};

export default AccountPage;
