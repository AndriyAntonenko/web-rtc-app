import { IMediaDevicesService } from '../types/interfaces/IMediaDevicesService';

class MediaDevicesService implements IMediaDevicesService {
  /**
   * Get list of devices by type
   */
  public async getConnectedDevices(type: MediaDeviceKind): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type);
  }
}

export { MediaDevicesService }
