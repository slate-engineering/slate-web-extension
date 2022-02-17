import React from "react";

const ProgressBar = (props) => {
  return (
    <div className="modalProgressContainer">
      <div className="modalProgressBar" style={{ width: props.progress }}></div>
    </div>
  );
};

export default ProgressBar;
