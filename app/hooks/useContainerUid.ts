import { useSocket, useSocketEvent } from "socket.io-react-hook"

export const useContainerUid = () => {
  const socketServer = "http://ledger-nfc.local:3000"

  const { socket, connected } = useSocket(socketServer)
  const { lastMessage } = useSocketEvent<{ uid: string }>(socket, "tag:scanned")


  return {
    uid: lastMessage?.uid,
    connect: socket.close,
    disconnect: socket.close,
    socket,
    connected,
    socketServer
  }
}
