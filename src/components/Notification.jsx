import { FaBell } from "react-icons/fa"
import "./Notification.css"

function Notification({title , message}){
    return <div className="note">
        <FaBell/>
        <h2>{title}</h2>
        <p>{message}</p>
    </div>
}

export default Notification