import "./SidebarChat.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { format } from "timeago.js";
import axios from "./axios";
import { useStateValue } from "./StateProvider";

const SidebarChat = ({ room }) => {
  const [{ user }, dispatch] = useStateValue();
  const deleteRoom = async () => {
    const validate = prompt(`Are you Sure to delete ${room?.name} Room ?`);
    if (validate !== null) {
      await axios
        .delete(`/rooms/${room?._id}`, { data: { email: user?.email } })
        .then((res) => {
          console.log(res.data);
        });
    }
  };
  return (
    <Link to={`/rooms/${room._id}`}>
      <div className={"sidebarChat"}>
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
    </Link>
  );
};

export default SidebarChat;
