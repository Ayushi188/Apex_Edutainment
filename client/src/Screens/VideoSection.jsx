import React from 'react';
import ReactPlayer from 'react-player';

const VideoSection = () => {
  return (
    <div className="video-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mx-auto">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=igcoDFokKzU" 
              width="100%"
              height="450px"
              controls={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
