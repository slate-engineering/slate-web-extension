import React, { useState } from "react";
import * as SVG from "Common/SVG";
import * as Utilities from "Common/utilities";

import { useModalContext } from "../Contexts/ModalProvider";

const Header = (props) => {
  let avatar = props.user ? Utilities.getAvatarUrl(props.user) : null;

  const { navigateToHome } = useModalContext();

  return (
    <div className="modalHeader">
      {props.goBack ? (
        <div className="modalGoBack" onClick={navigateToHome}>
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
      ) : avatar ? (
        <div
          className="modalGoBack"
          style={{ backgroundImage: `url('${avatar}')` }}
        />
      ) : null}

      <p className="modalHeaderTitle">{props.title}</p>
    </div>
  );
};

export default Header;
