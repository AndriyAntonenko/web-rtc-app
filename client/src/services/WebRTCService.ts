class WebRTCService {
  static peerConnection: RTCPeerConnection;

  static getConnection(): RTCPeerConnection {
    if (!WebRTCService.peerConnection) {
      WebRTCService.peerConnection = new RTCPeerConnection();
    }

    return WebRTCService.peerConnection;
  }

  static async createOffer(): Promise<RTCSessionDescriptionInit> {
    const connection = WebRTCService.getConnection();
    const offer = await connection.createOffer();
    await connection.setLocalDescription(new RTCSessionDescription(offer));

    return offer;
  }

  static async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const connection = WebRTCService.getConnection()
    await connection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await connection.createAnswer();
    await connection.setLocalDescription(
      new RTCSessionDescription(answer)
    );

    return answer;
  }

  static async setRemoteDescription(answer: RTCSessionDescriptionInit): Promise<void> {
    await WebRTCService.getConnection().setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }
}

export { WebRTCService };
