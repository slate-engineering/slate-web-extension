import React from "react";
import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

const Button = (props) => {
  const icons = {
    command: <SVG.MacCommand width="16px" height="16px" />,
    plus: <SVG.Plus width="20px" height="20px" />,
    account: <SVG.Account width="22px" height="22px" />,
    uploads: <SVG.Upload width="16px" height="16px" />,
    eye: <SVG.Layers width="16px" height="16px" />,
  };

  let svg = icons[props.icon];

  const handleClick = (e) => {
    if (props.run === "OPEN_LINK") {
      let url = Strings.getSlateFileLink(props.data.data.data.cid, 100);
      window.open(url, "_blank").focus();
      return;
    }

    window.postMessage({ run: props.run }, "*");
  };

  const handleHover = () => {
    props.onChange(props.id);
  };

  if (props.onEnter && props.id === props.highlight) {
    handleClick();
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="modalButtonMain"
        onMouseEnter={handleHover}
        style={{
          backgroundColor: props.id === props.highlight ? "#F7F8F9" : "#fff",
        }}
      >
        <div className="svgcontainer">{svg}</div>
        <div className="modalButtonText">{props.text}</div>
        {props.id === props.highlight && (
          <div
            style={{
              position: "absolute",
              right: "20px",
              color: "#8E9093",
              fontSize: "14px",
            }}
          >
            <span className="modalKeyIcon">enter</span>
            <span className="modalCommandIcon">⏎</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Button;
