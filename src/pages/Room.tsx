import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer/VideoPlayer";
import { PeerState } from "../context/peerReducer";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
  const { id } = useParams();
  const { webSocket, me, stream, peers } = useContext(RoomContext);

  useEffect(() => {
    if (me) webSocket.emit("join-room", { roomId: id, peerId: me._id });
  }, [id, me, webSocket]);

  return (
    <>
      <p>room {id}</p>
      <VideoPlayer stream={stream} />
      {Object.values(peers as PeerState).map((peer) => {
        return <VideoPlayer stream={peer.stream} />;
      })}
    </>
  );
};
