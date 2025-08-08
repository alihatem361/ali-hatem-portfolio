import React from "react";

const LoomVideo = ({ videoUrl }) => {
  const embedUrl =
    videoUrl.replace("share", "embed") + "&autoplay=1&mute=1&autoplay=1";

  return (
    <React.Fragment>
      <div
        className="loom-video-wrapper"
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: "0",
          borderRadius: "15px",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <iframe
          src={embedUrl}
          frameBorder="0"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen
          loading="lazy"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            borderRadius: "15px",
          }}
        ></iframe>
      </div>
    </React.Fragment>
  );
};

export default LoomVideo;
