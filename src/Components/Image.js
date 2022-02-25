import React from "react";

const Image = (props) => {
  return (
    <>
      <img
        src={props.url}
        width={props.width}
        height={props.height}
        alt={props.url}
        style={{
          borderRadius: "8px",
          marginTop: "8px",
          objectFit: "cover",
          minHeight: "20px",
          minWidth: "20px",
        }}
      />
    </>
  );
};

export default Image;
