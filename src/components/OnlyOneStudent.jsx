import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OOS.css"
import PremiumModal from "./PremiumModal";
import getStudents from "../utils/getStudents";

function OnlyOneStudent(){
    const {studentID} = useParams();
    const ref = useRef(false)
    const [student , setStudent] = useState(getStudents().find(item => String(item.id) === String(studentID)))
    const navigate = useNavigate();
    if(!student){
        return <div className="oos-not">
            <h2>Iltimos o'quvchini tanlab kiring</h2>
        </div>
    }

    return <div className="oos">
        <h2>{student?.name}ning davomat sahifasi</h2>
        <div className="oos-header">
            <button onClick={()=>navigate(-1)}>Qaytish</button>
            <button className="premium" onClick={()=> ref.current.showModal()}>O'quvchi sahifasini ochish</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Sana</th>
                    <th>Holat</th>
                </tr>
            </thead>
            <tbody>
                {student?.attendance?.map(item => {
                    return <tr key={item[0]}>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                    </tr>
                })}
            </tbody>
        </table>
        <PremiumModal ref={ref} message={"O'quvchi sahifasini ochish"}/>
    </div>
}

export default OnlyOneStudent;