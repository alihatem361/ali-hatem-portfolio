import React from "react";

const LoomVideo = ({ videoUrl }) => {
  const embedUrl =
    videoUrl.replace("share", "embed") + "&autoplay=1&mute=1&autoplay=1";

  return (
    <React.Fragment>
      <div
        style={{ position: "relative", paddingBottom: "56.25%", height: "0" }}
      >
        <iframe
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </div>
    </React.Fragment>
  );
};

export default LoomVideo;
