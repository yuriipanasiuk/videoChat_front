import { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";

export const CreateButton: React.FC = () => {
  const { webSocket } = useContext(RoomContext);

  const createRoom = () => {
    webSocket.emit("create-room"); //надсилання на сервер на приєжнання до кімнати
  };
  return (
    <>
      <button onClick={createRoom}>connect</button>
    </>
  );
};
