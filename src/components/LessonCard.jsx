import { useNavigate } from "react-router-dom"
import "./LessonCard.css"

function LessonCard({lesson}){
    let navigate = useNavigate();
    function handleWatch(){
        navigate(`/students/${lesson?.lesson}`)
    }
    return <div className="lesson-card">
        <div className="lesson-info">
            <h2>{lesson?.lesson}</h2>
            <p>Guruhi</p>
        </div>
        <button className="lesson-card-btn" onClick={handleWatch}>O'quvchilarni ko'rish</button>
    </div>
}

export default LessonCard