import Pusher from "pusher-js";

const pusher = new Pusher("4545027cb6b998bbe04d", {
  cluster: "eu",
});
export const channel = pusher.subscribe("rooms");
