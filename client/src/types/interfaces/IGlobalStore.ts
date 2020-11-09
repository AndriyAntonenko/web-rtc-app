import { IWebSocketConnectionData } from '@webrtc_experiment/shared';

export interface IGlobalStore {
  users: string[];
  wsConnectionData: Partial<IWebSocketConnectionData>;
}
