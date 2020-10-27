import React from 'react';

interface IVideoProps {
  stream: MediaStream;
}

const Video: React.FC<IVideoProps> = ({ stream }) => {
  const videoRef = React.createRef<HTMLVideoElement>();

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <video ref={videoRef} autoPlay playsInline controls={false} >
    </video>
  );
};

export { Video };
