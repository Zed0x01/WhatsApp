import "./Chat.css";
import { Avatar, IconButton, Modal } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import { format } from "timeago.js";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "./axios";
import { useStateValue } from "./StateProvider";
import Pusher from "pusher-js";

const Chat = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const messagesView = useRef(null);
  const [search, setSearch] = useState("");
  const [searchBar, setSearchBar] = useState(false);

  const fetchData = async (type) => {
    if (type === "chatData") {
      const chatData = await axios.get(`/rooms/${roomId}`);
      console.log("Chat Data");
      setRoom(chatData?.data[0]);
    } else {
      const chatMessages = await axios.get(`/rooms/messages/${roomId}`);
      console.log(chatMessages.data);
      console.log("Chat Messages");
      setMessages(chatMessages?.data);
    }
  };

  useEffect(() => {
    const filteredData = messages.filter((message) =>
      search !== ""
        ? message.text.toLowerCase().includes(search.toLowerCase())
        : messages
    );
    setFilteredMessages(filteredData);
  }, [messages, search]);

  useEffect(() => {
    fetchData("chatData");
    fetchData("chatMessages");
    const pusher = new Pusher("4545027cb6b998bbe04d", {
      cluster: "eu",
    });
    const channel = pusher.subscribe("rooms");
    channel.bind("inserted", function (newRoom) {
      fetchData("chatMessages");
      messagesView?.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [roomId]);

  const sendMessage = async () => {
    await axios.post(`/messages/${roomId}`, {
      name: user.displayName,
      text: message,
    });
    setMessage("");
  };

  return (
    <div className={"chat"}>
      <div className="chat__header">
        <Avatar src={room?.photoURL} />
        <div className="chat__headerInfo">
          <h3>{room?.name}</h3>
          <p>{format(room?.updatedAt)}</p>
        </div>
        <div className="chat__headerRight">
          {searchBar && (
            <input
              className={"chat__headerRightSearch"}
              type={"text"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Search Messages"}
            />
          )}
          <IconButton>
            <SearchIcon onClick={() => setSearchBar((prev) => !prev)} />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body" ref={messagesView}>
        {filteredMessages?.map((message) => (
          <p
            key={message._id}
            className={`chat__message ${
              message.name === user.displayName ? "chat__receiver" : ""
            }`}
          >
            <span className={"chat__name"}>{message.name}</span>
            {message.text}
            <span className={"chat__timestamp"}>
              {format(message.createdAt)}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={"Type a message"}
          />
          <button type={"submit"} onClick={sendMessage}>
            Send a Message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};
export default Chat;
