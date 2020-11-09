import React from 'react';
import { connect } from 'react-redux';
import { SocketEventTypes, IWebSocketConnectionData } from '@webrtc_experiment/shared';

import { Video } from './component/Video';
import { UserList } from './component/UserList';

import { MediaDevicesService } from './services/MediaDeviceService';
import { CameraService } from './services/CameraService';
import { WebSocketService } from './services/WebSocketService';

import { actions } from './store/reducers/wsConnection';

import './App.css';

interface IAppProps {
  addConnectionData: typeof actions.addConnectionData;
}

function App(props: IAppProps): JSX.Element {
  const [videoStream, setVideoStream] = React.useState<MediaStream>();
  const [wsService, setWsService] = React.useState<WebSocketService>();

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

    wsService.onOpen(() => {
      console.info('Open!!!');
      wsService.sendMessage('Hello!');
      setWsService(wsService);
    

      wsService.addOnEventHandler<IWebSocketConnectionData>(
        SocketEventTypes.UPDATE_MY_CONNECTION_DATA, 
        async (eventData: IWebSocketConnectionData) => {
          props.addConnectionData(eventData);
        }
      );
    });
  }, [props]);

  return (
    <div className="App">
      {videoStream && <Video stream={videoStream} />}
      <br />
      {wsService && <UserList wsService={wsService} />}
    </div>
  );
}

const actionCreators: IAppProps = {
  addConnectionData: actions.addConnectionData
};

export default connect(null, actionCreators)(App);
