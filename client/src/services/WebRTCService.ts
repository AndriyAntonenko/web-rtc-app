class WebRTCService {
  static peerConnection: RTCPeerConnection;

  static getConnection(): RTCPeerConnection {
    if (!WebRTCService.peerConnection) {
      WebRTCService.peerConnection = new window.RTCPeerConnection();
    }

    return WebRTCService.peerConnection;
  }

  static async createOffer() {
    const connection = WebRTCService.getConnection();
    const offer = await connection.createOffer();
    await connection.setLocalDescription(new window.RTCSessionDescription(offer));

    return offer;
  }
}

export { WebRTCService };
