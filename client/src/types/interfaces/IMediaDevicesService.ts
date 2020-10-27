export interface IMediaDevicesService {
  getConnectedDevices(type: MediaDeviceKind): Promise<MediaDeviceInfo[]>;
}
