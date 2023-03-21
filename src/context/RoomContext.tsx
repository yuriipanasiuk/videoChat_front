import React, { createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import socketIo from "socket.io-client";
import Peer from "peerjs";
import { v4 } from "uuid";
import { peerReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

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
  const [screenSharingId, setScreenSharingId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }): any => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log({ participants });
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const meId = v4();
    const peer = new Peer(meId);
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }
    webSocket.on("room-created", enterRoom);
    webSocket.on("get-users", getUsers);
    webSocket.on("user-disconnected", removePeer);
    webSocket.on("user-shared-screen", (peerId) => {
      setScreenSharingId(peerId);
    });
    webSocket.on("user-stoped-screen", () => {
      setScreenSharingId("");
    });
    return () => {
      webSocket.off("room-created");
      webSocket.off("get-users");
      webSocket.off("user-disconnected");
      webSocket.off("user-shared-screen");
      webSocket.off("user-stoped-screen");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (screenSharingId) {
      webSocket.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      webSocket.emit("stop-sharing");
    }
  }, [roomId, screenSharingId]);

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

  const switchScreen = (stream: MediaStream) => {
    setStream(stream);
    setScreenSharingId(me?.id || "");

    if (me) {
      Object.values(me.connections).forEach((connection: any) => {
        const videoTrack = stream
          ?.getTracks()
          .find((track) => track.kind === "video");

        connection[0].peerConnection
          .getSenders()[1]
          .replaceTrack(videoTrack)
          .catch((err: any) => console.log(err));
      });
    }
  };

  const shareScreen = () => {
    if (screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchScreen);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then(switchScreen);
    }
  };

  return (
    <RoomContext.Provider
      value={{
        webSocket,
        me,
        stream,
        peers,
        shareScreen,
        screenSharingId,
        setRoomId,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
