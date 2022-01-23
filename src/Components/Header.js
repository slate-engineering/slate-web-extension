import React, { useState } from "react";

import * as SVG from "Common/SVG";
import * as Utilities from "Common/utilities";

const Header = (props) => {
  let avatar = Utilities.getAvatarUrl(props.user);

  const handleGoBack = () => {
    window.postMessage({ run: "OPEN_HOME_PAGE" }, "*");
  };

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
