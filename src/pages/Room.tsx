import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShareDesctop } from "../components/ShareDesctop/ShareDesctop";
import { VideoPlayer } from "../components/VideoPlayer/VideoPlayer";
import { PeerState } from "../context/peerReducer";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
  const { id } = useParams();
  const {
    webSocket,
    me,
    stream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
  } = useContext(RoomContext);

  useEffect(() => {
    if (me) webSocket.emit("join-room", { roomId: id, peerId: me._id });
  }, [id, me, webSocket]);

  useEffect(() => {}, [id, setRoomId]);

  const screenSharingVideo =
    screenSharingId === me?._id ? stream : peers[screenSharingId]?.stream;

  return (
    <>
      <p>room {id}</p>
      <div>
        {screenSharingVideo && (
          <div>
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
      </div>
      <VideoPlayer stream={stream} />
      {Object.values(peers as PeerState).map((peer) => {
        return <VideoPlayer stream={peer.stream} />;
      })}
      <ShareDesctop onClick={shareScreen} />
    </>
  );
};
