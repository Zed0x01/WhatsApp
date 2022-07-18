import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import { format } from "timeago.js";
import { useEffect, useState, useRef, memo } from "react";
import axios from "./axios";
import { channel } from "./Pusher";
import { useStateValue } from "./StateProvider";
import Picker from "emoji-picker-react";

const Chat = () => {
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [{ user, roomIds }, dispatch] = useStateValue();
  const messagesView = useRef(null);
  const [search, setSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchBar, setSearchBar] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/rooms/${roomIds}`);
      setRoom(res?.data?.roomData[0]);
      setMessages(res?.data?.roomMessages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (roomIds !== null) {
      channel.bind("updated", (data) => {
        fetchData();
        messagesView?.current?.scrollIntoView({ behavior: "smooth" });
      });
      return () => {
        channel.unbind("updated");
      };
    }
  }, []);

  useEffect(() => {
    const filteredData = messages.filter((message) =>
      search !== ""
        ? message?.text?.toLowerCase().includes(search.toLowerCase())
        : messages
    );
    setFilteredMessages(filteredData);
  }, [messages, search]);

  useEffect(() => {
    if (roomIds !== null) {
      const x = fetchData();
    }
  }, [roomIds]);

  const sendMessage = async () => {
    await axios
      .post(`/messages/${roomIds}`, {
        name: user.displayName,
        text: message,
      })
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
    setMessage("");
  };
  const onEmojiClick = (event, emojiObject) => {
    setMessage((prev) => prev.concat(emojiObject.emoji));
  };

  return (
    <div className={"chat"}>
      {roomIds !== null ? (
        <>
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
                  {format(message.createdAt).toString()}
                </span>
              </p>
            ))}
          </div>

          <div className="chat__footer" style={{ position: "relative" }}>
            {showEmoji === true && (
              <div
                style={{ position: "absolute", bottom: "80px", left: "10px" }}
              >
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <InsertEmoticonIcon
              style={{ cursor: "pointer" }}
              onClick={() => setShowEmoji((prev) => !prev)}
            />
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
        </>
      ) : (
        <h1 style={{ margin: "10px auto" }}>Please Choose Chat</h1>
      )}
    </div>
  );
};
export default memo(Chat);
