import React from "react";

const YoutubeVideo = ({ project }) => {
  return (
    <React.Fragment>
      {project.videoKey ? (
        <div className="youtube-video-wrapper">
          <iframe
            width="100%"
            height="500px"
            src={`https://www.youtube.com/embed/${project.videoKey}?mute=1&autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            style={{
              borderRadius: "15px",
              minHeight: "400px",
            }}
          ></iframe>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default YoutubeVideo;
