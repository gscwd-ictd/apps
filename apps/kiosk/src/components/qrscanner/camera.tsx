import React from 'react';
import Webcam from 'react-webcam';

class WebcamCapture extends React.Component {
  render() {
    const videoConstraints = {
      facingMode: 'user',
      width: 640,
      height: 480,
    };

    return <Webcam videoConstraints={videoConstraints} />;
  }
}

export default WebcamCapture;
