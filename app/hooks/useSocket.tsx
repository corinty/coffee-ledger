import { useState, useEffect, createContext, useContext } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";

const wsContext = createContext<
  {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined,
    connect: () => void,
    disconnect: () => void
  } | null
>(null);


export function useSocketProvider({ server, delayConnection }: { server: string, delayConnection?: boolean }) {
  let [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();


  useEffect(() => {
    if (!delayConnection) {
      setSocket(io(server));
    }
    return () => {
      socket?.close();
    };
  }, [delayConnection, server, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("event", (data) => {
      console.log("parent hook", data);
    });

  }, [socket])

  const connect = () => {
    setSocket(io(server))
  }
  const disconnect = () => {
    socket?.close()
  }


  // eslint-disable-next-line react/display-name
  return ({ children }) => (
    <wsContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </wsContext.Provider>
  )

}

export function useSocket() {
  let socket = useContext(wsContext)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!socket) return
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
  }, [socket])


  return { socket, isConnected, }
}

export default useSocket
