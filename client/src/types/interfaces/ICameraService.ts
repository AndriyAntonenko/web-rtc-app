import { IMediaDevicesService } from './IMediaDevicesService';

export interface ICameraService {
  mediaDevicesService: IMediaDevicesService;
  openCamera(cameraId: string, minWidth: number, minHeight: number): Promise<MediaStream>;
}
