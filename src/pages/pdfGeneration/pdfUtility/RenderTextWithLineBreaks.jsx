import React from "react";

const RenderTextWithLineBreaks = (text) => {
  return text.split("\n\n").map((part, index) => (
    <span key={index}>
      {part}
      {index !== text.split("\n\n").length - 1 && (
        <>
          <br />
          <br />
        </>
      )}
    </span>
  ));
};

export default RenderTextWithLineBreaks;
