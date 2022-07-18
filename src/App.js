import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import Pusher from "pusher-js";
import axios from "./axios";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { channel } from "./Pusher";
import { ACTIONS } from "./reducer";

function App() {
  const [Rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const auth = getAuth();
  const fetchRooms = async () => {
    const res = await axios.get("/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: ACTIONS.SET_USER,
          user: user,
        });
      } else {
        dispatch({
          type: ACTIONS.SET_USER,
          user: null,
        });
      }
    });
  }, [auth]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    channel.bind("inserted", function (newRoom) {
      fetchRooms();
    });
  }, []);
  return (
    <div className="app">
      {user ? (
        <div className="app__body">
          <Router>
            <Sidebar rooms={Rooms} />
            <Routes>
              <Route path={"/"} element={<Navigate to={"/rooms"} />} />
              <Route path={"/rooms/:roomId"} element={<Chat />} />
            </Routes>
          </Router>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
