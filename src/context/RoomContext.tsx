import React, { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socketIo from "socket.io-client";

const HOST_BACKEND = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);
const webSocket = socketIo(HOST_BACKEND);

interface RoomProviderProps {
  children: React.ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }): any => {
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    webSocket.on("room-created", enterRoom);
  }, []);

  return (
    <RoomContext.Provider value={{ webSocket }}>
      {children}
    </RoomContext.Provider>
  );
};
