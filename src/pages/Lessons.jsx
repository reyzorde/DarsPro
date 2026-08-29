import { useRef, useState } from "react";
import LessonCard from "../components/LessonCard";
import "./Lessons.css"
import PremiumModal from "../components/PremiumModal";

function Lessons(){
    const lessons = useRef(["Matematika" , "Fizika" , "Biologiya" , "Kimyo" , "SAT" , "Ingliz-tili"]);
    const modal = useRef(false);
    function handleShow(){
        modal.current.showModal()
    }
    return <div className="lessons-wrapper">
        <div className="lessons-header">
            <h2>Bu guruhlar majburiy</h2>
            <button onClick={handleShow} className="premium">Guruh qo'shish</button>
        </div>
        <PremiumModal message={"Guruh qo'shish"} ref={modal}/>
        <div className="lessons-list">
            <h2>Guruhlar ro'yxati</h2>
            {
                lessons.current.map(lesson => (<LessonCard lesson={lesson} key={lesson}/>))
            }
        </div>
    </div>
}

export default Lessons;