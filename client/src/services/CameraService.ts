import { ICameraService } from '../types/interfaces/ICameraService';
import { IMediaDevicesService } from '../types/interfaces/IMediaDevicesService';

class CameraService implements ICameraService {
  constructor(public readonly mediaDevicesService: IMediaDevicesService) {}
  /**
   * Get MediaStream of specific camera
   */
  public async openCamera(cameraId: string, minWidth: number, minHeight: number): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: { echoCancellation: true },
      video: {
        deviceId: cameraId,
        width: { min: minWidth },
        height: { min: minHeight }
      }
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  public async getAvailableCameras() {
    return await this.mediaDevicesService.getConnectedDevices('videoinput');
  }
}

export { CameraService };
