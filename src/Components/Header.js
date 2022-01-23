import React, { useState } from "react";

import * as SVG from "../Common/SVG";

const Header = (props) => {
  let [avatar, setAvatar] = useState(null);

  const handleGoBack = () => {
    window.postMessage({ run: "OPEN_HOME_PAGE" }, "*");
  };

  const checkImage = (url) => {
    let avatar = new Image();
    avatar.addEventListener("load", () => {
      setAvatar(url);
    });
    avatar.src = url;
  };

  if (props.user.loaded) {
    checkImage(props.user.data.data.photo);
  }

  if (!avatar) {
    let colors = ["A9B9C1", "5B6B74", "3C444A", "D4DBDF", "293137"];
    avatar = `https://source.boringavatars.com/marble/24px/${props.user.id}?square&colors=${colors}`;
  }

  return (
    <div className="modalHeader">
      {props.goBack ? (
        <div className="modalGoBack" onClick={handleGoBack}>
          <SVG.ChevronLeft
            width="16px"
            height="16px"
            style={{
              margin: "auto",
              marginTop: "3px",
              display: "block",
            }}
          />
        </div>
      ) : (
        <div
          className="modalGoBack"
          style={{ backgroundImage: `url('${avatar}')` }}
        />
      )}

      <p className="modalHeaderTitle">{props.title}</p>
    </div>
  );
};

export default Header;
