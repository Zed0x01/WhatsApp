import { Button } from "@mui/material";
import "./Login.css";
import { signInWithPopup } from "firebase/auth";
import { myAuth, provider } from "./firebase";
import { useStateValue } from "./StateProvider";
import { ACTIONS } from "./reducer";

const Login = () => {
  const [{}, dispatch] = useStateValue();
  const auth = myAuth();
  const handleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      dispatch({
        type: ACTIONS.SET_USER,
        user: data.user,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={"login"}>
      <div className={"login__container"}>
        <img src="https://bit.ly/3RHSOI3" alt="" />
        <div className="login__text">
          <h1>Sign in to WhatsApp</h1>
        </div>
        <Button onClick={handleLogin}>Sign In With Google</Button>
      </div>
    </div>
  );
};

export default Login;
