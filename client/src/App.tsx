import React from 'react';

import { Video } from './component/Video';

import { MediaDevicesService } from './services/MediaDeviceService';
import { CameraService } from './services/CameraService';
import { WebSocketService } from './services/WebSocketService';

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

  React.useEffect(() => {
    const wsService = new WebSocketService('ws://localhost:5000');

    wsService.addOnOpenHandler(() => {
      console.info('Open!!!');
      wsService.sendMessage('Hello!');
    });

    wsService.addOnCloseHandler(() => {
      console.info('Closed!!!');
    });

    wsService.addOnErrorHandler(() => {
      console.error('Error!!!');
    })
  }, []);

  return (
    <div className="App">
      {videoStream && <Video stream={videoStream} />}
    </div>
  );
}

export default App;
