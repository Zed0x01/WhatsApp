import "./SidebarChat.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { format } from "timeago.js";
import axios from "./axios";
import { useStateValue } from "./StateProvider";
import { ACTIONS } from "./reducer";

const SidebarChat = ({ room }) => {
  const [{ user, roomIds }, dispatch] = useStateValue();
  const deleteRoom = async () => {
    const validate = prompt(`Are you Sure to delete ${room?.name} Room ?`);
    if (validate !== null) {
      await axios
        .delete(`/rooms/${room?._id}`, { data: { email: user?.email } })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const setRoom = () => {
    dispatch({
      type: ACTIONS.SET_RO_ID,
      room: room._id,
    });
  };

  return (
    <div className={"sidebarChat"} onClick={setRoom}>
      <Avatar src={room?.photoURL} />
      <div className="sidebarChat__info">
        <h2>{room?.name}</h2>
        <p>last Activity at : {format(room?.updatedAt)} </p>
      </div>
      {user?.email === "sherifashrafmedia@gmail.com" && (
        <DeleteForeverIcon
          className={"sidebarChat__delete"}
          onClick={deleteRoom}
        />
      )}
    </div>
  );
};

export default SidebarChat;
