import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Attendance.css"
import { FaPen, FaSearch } from "react-icons/fa";
import getToday from "../utils/getToday";
import getStudents from "../utils/getStudents";
import { supabase } from "../supabaseClient";


function Attendance() {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const filteredStudents = students.filter(student => {
        const text = search.toLowerCase();

        return student?.name?.toLowerCase().includes(text);
    });

    const absentStudents = filteredStudents?.filter(x => x.attendance.at(-1)[1] === "Kelmagan").length;
    const presentStudents = filteredStudents?.filter(x => x.attendance.at(-1)[1] !== "Kelmagan").length;

    useEffect(() => {
        async function load() {
            let data = await getStudents();
            setStudents(data);
        }
        load()
    }, []);

    function getTodayAttendance(student) {
        const today = getToday();

        return student.attendance?.find(
            item => item[0] === today
        )?.[1] || "Kiritilmagan";
    }


    function persentageStudents(state) {
        const absentStudents = filteredStudents.filter(
            student => getTodayAttendance(student) === "Kelmagan"
        ).length;

        const presentStudents = filteredStudents.filter(
            student => getTodayAttendance(student) !== "Kelmagan"
        ).length;
        if(state === "absent"){
            return Math.floor((absentStudents*100)/(absentStudents+presentStudents))
        }else{
            return Math.ceil((presentStudents*100)/(absentStudents+presentStudents))
        }
    }



    return <div className="attendance-wrapper">
        <div className="att-header">
            <h2>Davomat</h2>
            <p>Har bir o'quvchining davomati haqida xabardor bo'ling</p>
        </div>
        <div className="att-percentage">
            <div className="att-div1">
                <h2>Kelmaganlar</h2>
                <p>{absentStudents ? absentStudents : 0}</p>
                <p>{persentageStudents("absent") || 0} foiz</p>
            </div>
            <div className="att-div2">
                <h2>Kelganlar</h2>
                <p>{presentStudents ? presentStudents : 0}</p>
                <p>{persentageStudents("Present") || 0} foiz</p>
            </div>
        </div>
        <div className="search-input">
            <input type="text" placeholder="Kimni ko'rmoqchisiz" value={search || ""} onChange={e => setSearch(e.target.value)} id="search" />
            <FaSearch />
        </div>
        <div className="att-body">
            <table>
                <thead>
                    <tr>
                        <td>Ism</td>
                        <td>Sana</td>
                        <td>Holat</td>
                        <td>Ko'rish</td>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(item => {
                        return <tr key={item?.id}>
                            <td>{item?.name}</td>
                            <td>{getToday()}</td>
                            <td>{getTodayAttendance(item)} </td>
                            <td><button onClick={() => navigate(`/oos/${item?.id}`)}>O'quvchi davomatini ko'rish</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </div>
}

export default Attendance;