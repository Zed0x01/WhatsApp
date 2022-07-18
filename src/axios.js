import axios from "axios";

const backend_URL = "https://whatsapp-clone-30.herokuapp.com/";
const instance = axios.create({
  baseURL: "http://localhost:9000/",
});

export default instance;
