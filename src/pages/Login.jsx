import { useState } from "react";
import "./Login.css";
import loginTeacher from "../utils/login";

function Login() {
  const [password, setPassword] = useState("");
  const [login , setLogin] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className="login">
      <div className="login-box">
        <h2>Login</h2>

        <p>Xush kelibsiz</p>

        <input type="text" placeholder="Loginni kiriting" onChange={(e)=>setLogin(e.target.value)}/>

        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parolni kiriting"
        />

        <button
          className="show-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Parolni yashirish" : "Parolni ko'rish"}
        </button>

        <button className="login-btn" onClick={()=> loginTeacher(login , password)}>
          Kirish
        </button>
      </div>
    </div>
  );
}

export default Login;