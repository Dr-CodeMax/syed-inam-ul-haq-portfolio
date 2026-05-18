import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  connectSocket,
  disconnectSocket,
  subscribeToSocket,
  sendSocketMessage,
} from "../services/socket";

import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();

  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      disconnectSocket({
        clearListeners: true,
      });
      setConnected(false);
      setLastMessage(null);
      return;
    }

    connectSocket({
      onOpen: () => {
        setConnected(true);
      },
      onClose: () => {
        setConnected(false);
      },
      onError: () => {
        setConnected(false);
      },
      onMessage: (data) => {
        setLastMessage(data);
      },
    });

    return () => {
      disconnectSocket();
    };
  }, [user?.id]);

  const value = useMemo(
    () => ({
      connected,
      lastMessage,
      subscribeToSocket,
      sendSocketMessage,
    }),
    [connected, lastMessage]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
