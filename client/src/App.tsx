import React from 'react';
import { connect } from 'react-redux';
import { 
  SocketEventTypes, 
  IWebSocketConnectionData, 
  ICallUserOffer,
  ICallMadeUserOffer,
  IMakeAnswer,
  IAnswerMade
} from '@webrtc_experiment/shared';

import { IGlobalStore } from './types/interfaces/IGlobalStore';
import { Video } from './component/Video';
import { UserList } from './component/UserList';

import { MediaDevicesService } from './services/MediaDeviceService';
import { CameraService } from './services/CameraService';
import { WebSocketService } from './services/WebSocketService';
import { WebRTCService } from './services/WebRTCService';

import { actions } from './store/reducers/wsConnection';

import './App.css';

interface IAppProps {
  addConnectionData: typeof actions.addConnectionData;
  deleteConnectionData: typeof actions.deleteConnectionData;
  wsConnection: Partial<IWebSocketConnectionData>;
}

function App(props: IAppProps): JSX.Element {
  const { deleteConnectionData, wsConnection, addConnectionData } = props;

  const [videoStream, setVideoStream] = React.useState<MediaStream>();
  const [remoteStreams, setRemoteStreams] = React.useState<readonly MediaStream[]>([]);
  const [wsService, setWsService] = React.useState<WebSocketService>();
  const [isAlreadyCalling, setIsAllReadyCalling] = React.useState(false);

  React.useEffect(() => {
    const mediaDeviceService = new MediaDevicesService();
    const cameraService = new CameraService(mediaDeviceService);

    cameraService.getAvailableCameras()
      .then(cameras => cameras[0])
      .then(camera => cameraService.openCamera(camera.deviceId, 640, 480))
      .then(stream => {
        stream.getTracks().forEach(track => WebRTCService.getConnection().addTrack(track, stream));
        setVideoStream(stream);
      })
      .catch(console.error);
  }, []);

  const callUser = React.useCallback(
    async (userId: string) => {
      if (!wsConnection.id) {
        return;
      }
  
      const offer = await WebRTCService.createOffer();
  
      wsService?.sendMessage<ICallUserOffer>({ event: SocketEventTypes.CALL_USER, data: {
        to: userId,
        offer,
        from: wsConnection.id
      }});
    },
    [wsConnection.id, wsService]
  );

  React.useEffect(() => {
    const wsService = new WebSocketService('ws://localhost:5000');

    wsService.onOpen(() => {
      console.info('Open!!!');
      wsService.sendMessage('Hello!');
      setWsService(wsService);

      wsService.addOnEventHandler<IWebSocketConnectionData>(
        SocketEventTypes.UPDATE_MY_CONNECTION_DATA, 
        async (eventData: IWebSocketConnectionData) => {
          addConnectionData(eventData);
        }
      );

      wsService.onClose(() => {
        deleteConnectionData();
      });
    });
  }, [deleteConnectionData, addConnectionData]);


  React.useEffect(() => {
    if (wsService && wsConnection.id) {
      wsService?.addOnEventHandler<ICallMadeUserOffer>(
        SocketEventTypes.CALL_MADE,
        async (eventData: ICallMadeUserOffer) => {
          if (!wsService || !wsConnection.id) {
            return;
          }
  
          const answer = await WebRTCService.createAnswer(eventData.offer);
          wsService.sendMessage<IMakeAnswer>({
            event: SocketEventTypes.MAKE_ANSWER,
            data: { answer, to: eventData.userId, from: wsConnection.id }
          });
        }
      );
    }
  }, [wsService, wsConnection.id])

  React.useEffect(() => {
    if (wsService && videoStream) {
      wsService?.once<IAnswerMade>(
        SocketEventTypes.ANSWER_MADE,
        async (eventData: IAnswerMade) => {
          await WebRTCService.setRemoteDescription(eventData.answer);
          if (!isAlreadyCalling) {
            callUser(eventData.userId);
            setIsAllReadyCalling(true);
          }
        }
      );
    }
  }, [wsService, videoStream, isAlreadyCalling, callUser])

  React.useEffect(() => {
    WebRTCService.getConnection().addEventListener('track', data => {
      setRemoteStreams(data.streams);
    });
  }, []);

  return (
    <div className="App">
      {videoStream && <Video stream={videoStream} />}
      <br />
      {wsService && <UserList onUserClick={callUser} wsService={wsService} />}
      {remoteStreams.map((remoteStream, index) => <Video key={index} stream={remoteStream} /> )}
    </div>
  );
}

const mapStateToProps = (store: IGlobalStore) => ({
  wsConnection: store.wsConnectionData
})

const actionCreators = {
  addConnectionData: actions.addConnectionData,
  deleteConnectionData: actions.deleteConnectionData
};

export default connect(mapStateToProps, actionCreators)(App);
