import { io } from "socket.io-client"

class ChatSocket{
  socket = null

  constructor() {}

  static getInstance() {
    if (!ChatSocket.instance) {
        ChatSocket.instance = new ChatSocket()
    }

    return ChatSocket.instance
  }

  connect() {
    if (!this.socket) {
      this.socket = io("http://localhost:5501/chat")
    }

    return this.socket
  }
}

export default ChatSocket
