import React, { useState } from "react";

import * as SVG from "../Common/SVG";
import * as Strings from "../Common/strings";

const Metadata = (props) => {
  const [og, setOg] = useState(null);

  let count = 45;
  let title = Strings.truncateString(count, props.data.title);

  const checkImage = (url) => {
    let og = new Image();
    og.addEventListener("load", () => {
      setOg(url);
    });
    og.src = url;
  };

  checkImage(props.image);

  return (
    <>
      <div className="metadata">
        <div className="svgContainer" style={{ height: "50px" }}>
          {!props.status.uploaded ? (
            <SVG.Link
              width="16px"
              height="16px"
              style={{ marginTop: "16px", marginLeft: "16px" }}
            />
          ) : (
            <SVG.CheckCircle
              width="16px"
              height="16px"
              style={{ marginTop: "16px", marginLeft: "16px" }}
            />
          )}
        </div>
        <div className="metadataBox2">
          <div className="metaDataTitle">{title}</div>
          <div style={{ lineHeight: "16px" }} className="metaDataUrl">
            {Strings.getUrlHost(props.data.url)}
          </div>
        </div>

        <div className="metadataBox3">
          <img height="32px" src={og} />
        </div>
      </div>
    </>
  );
};

export default Metadata;
