import { FaX } from "react-icons/fa6"
import "./ErrorModal.css"

function ErrorModal({errorRef , title , message}){
    return <dialog ref={errorRef} className="error-modal">
        <div className="error-icon">
            <FaX/>
            <h1>{title}</h1>
        </div>
        <p>{message}</p>
        <button onClick={()=>errorRef.current.close()}>Yopish</button>
    </dialog>
}

export default ErrorModal