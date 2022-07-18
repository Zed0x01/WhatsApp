import "./Sidebar.css";
import ChatIcon from "@mui/icons-material/Chat";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "./StateProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import axios from "./axios";
import { ACTIONS } from "./reducer";

const Sidebar = ({ rooms }) => {
  const [{ user }, dispatch] = useStateValue();
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const nav = useNavigate();
  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleSignOut = async () => {
    const auth = getAuth();
    signOut(auth)
      .then((data) => {
        console.log("Signed Out");
        dispatch({ type: ACTIONS.SET_USER, user: null });
        nav("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const addNewChat = () => {
    const roomName = prompt("Enter Room Name");
    const roomImage = prompt("Enter Room Image URL ");
    if(roomImage && roomName !== null){
      axios
          .post("/rooms/new", {
            name: roomName,
            photoURL: roomImage,
          })
          .then((data) => {
            console.log(data.data);
          }).catch((err)=>{
        console.log(err);
      });
    }
  };
  useEffect(() => {
    const filteredChat = rooms?.filter((chat) =>
      search !== ""
        ? (chat?.name).toLowerCase().includes(search.toLowerCase())
        : rooms
    );
    setFilteredChats(filteredChat);
    console.log(filteredChat);
  }, [search,rooms]);
  return (
    <div className={"sidebar"}>
      <div className="sidebar__header">
        <Avatar src={user.photoURL} />
        <h1 style={{fontSize:"16px",marginTop:"10px"}}>{user?.displayName}</h1>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={handleMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>My account</MenuItem>
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </Menu>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search or start new chat"}
          />
        </div>
      </div>

      <div className="sidebar__chats">
        {user.email === "sherifashrafmedia@gmail.com" && (
          <button onClick={addNewChat} className={"sidebar__addChat"}>
            Add New Room
          </button>
        )}
        {filteredChats.map((room) => (
          <SidebarChat room={room} key={room._id} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
