import React, { createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import socketIo from "socket.io-client";
import Peer from "peerjs";
import { v4 } from "uuid";
import { peerReducer } from "./peerReducer";
import { addPeerAction } from "./peerActions";

const HOST_BACKEND = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);
const webSocket = socketIo(HOST_BACKEND);

interface RoomProviderProps {
  children: React.ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peerReducer, {});

  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }): any => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log({ participants });
  };

  useEffect(() => {
    const meId = v4();
    const peer = new Peer(meId);
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }
    webSocket.on("room-created", enterRoom);
    webSocket.on("get-users", getUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!me || !stream) return;

    webSocket.on("user-joined", ({ peerId }) => {
      const call = me.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
        console.log(peerStream);
      });
    });

    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  return (
    <RoomContext.Provider value={{ webSocket, me, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};
