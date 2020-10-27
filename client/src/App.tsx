import React from 'react';

import { Video } from './component/Video';

import { MediaDevicesService } from './services/MediaDeviceService';
import { CameraService } from './services/CameraService';

import './App.css';

function App() {
  const [videoStream, setVideoStream] = React.useState<MediaStream>();

  React.useEffect(() => {
    const mediaDeviceService = new MediaDevicesService();
    const cameraService = new CameraService(mediaDeviceService);

    cameraService.getAvailableCameras()
      .then(cameras => cameras[0])
      .then(camera => cameraService.openCamera(camera.deviceId, 640, 480))
      .then(stream => setVideoStream(stream))
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      {videoStream && <Video stream={videoStream} />}
    </div>
  );
}

export default App;
