import { useRef, useState } from "react";
import "./login.css";
import loginTeacher from "../utils/login";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/ErrorModal";
import logo from "../public/logo.png"

function Login() {
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const errorRef = useRef(null);
  let navigate = useNavigate();


  return (
    <div className="login">
      <div className="login-box">
        <img src={logo} alt="DarsPro logotip" width={100} height={100} className="login-logo" />
        <h2>Login</h2>

        <p>Xush kelibsiz</p>

        <input type="text" placeholder="Loginni kiriting" onChange={(e) => setLogin(e.target.value)} />

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

        <button className="login-btn" onClick={() => loginTeacher(login, password, navigate, errorRef)}>
          Kirish
        </button>
        <div className="signup">
          <p>Hali akkauntingiz yo'qmi?</p>

          <button
            type="button"
            onClick={() => {
              window.open(
                "https://t.me/darspro_bot",
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Yo'q
          </button>
        </div>

      </div>
      <ErrorModal errorRef={errorRef} title={"Xatolik"} message={"Xatolik yuz berdi. Iltimos birozdan so'ng qayta urinib ko'ring."} />
    </div>
  );
}

export default Login;