import { useEffect, useState } from "react"
import useSocket from "~/hooks/useSocket"




export default function NfcReader() {
  const { isConnected, socket } = useSocket()
  const [lastPong, setLastPong] = useState<string>("");




  useEffect(() => {
    if (!socket) return

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      if (!socket) return
      socket.off('pong');
    };
  }, [socket]);

  const sendPing = () => {
    socket!.emit('ping');
  }

  return (<div>
    <p>Connected: {'' + isConnected}</p>
    <p>Last pong: {lastPong || '-'}</p>
    <button onClick={sendPing}>Send ping</button>
  </div>)
}
