import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Attendance.css"
import { FaPen, FaSearch } from "react-icons/fa";
import getToday from "../utils/getToday";
import getStudents from "../utils/getStudents";

function Attendance() {
    const [students, setStudents] = useState(getStudents())
    const navigate = useNavigate()
    const [updateStudents, setUpdateStudents] = useState(null);
    const [newattendance, setNewattendance] = useState(null);
    const [search, setSearch] = useState("")
    const filteredStudents = students.filter(student => {
        const text = search.toLowerCase();
        return student.name?.toLowerCase().includes(text);
    });
    const absentStudents = filteredStudents?.filter(x => x.attendance.at(-1)[1] === "Kelmagan").length;
    const presentStudents = filteredStudents?.filter(x => x.attendance.at(-1)[1] !== "Kelmagan").length;

    useEffect(() => {
        if (!students.length) return;

        const finder = students.find(x => x.isActive);

        if (!finder) return;

        const lastDate = finder.attendance?.at(-1)?.[0];

        if (lastDate === getToday()) return;

        const update = students.map(student => ({
            ...student,
            attendance: [
                ...(student.attendance || []),
                [getToday(), "kiritilmagan"]
            ]
        }));

        localStorage.setItem("students", JSON.stringify(update));
        setStudents(update);

    }, []);


    function handleEdit(id) {
        let updating = students.find(item => item.id === id)
        setUpdateStudents(updating);
    }

    function handleSave(id) {
        if (!newattendance) {
            alert("To'ldirilmagan maydon mavjud");
            return;
        }

        const newStudents = students.map(student => {
            if (student.id === id) {
                return {
                    ...student,
                    attendance: [
                        ...student.attendance.filter(item => item[0] !== getToday()),
                        [getToday(), newattendance]
                    ]
                };
            }

            return student;
        });

        setStudents(newStudents)

        localStorage.setItem(
            "students",
            JSON.stringify(newStudents)
        );

        setNewattendance(null);
        setUpdateStudents(null);
    }

    function persentageStudents(state){
        if(state === "absent"){
            return Math.floor((absentStudents*100)/(absentStudents + presentStudents))
        }else {
             return Math.ceil((presentStudents*100)/(absentStudents + presentStudents))
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
                <p>{persentageStudents("absent")} foiz</p>
            </div>
            <div className="att-div2">
                <h2>Kelganlar</h2>
                <p>{presentStudents ? presentStudents : 0}</p>
                <p>{persentageStudents("Present")} foiz</p>
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
                        <td>Guruh</td>
                        <td>Tahrirlash</td>
                        <td>Ko'rish</td>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(item => {
                        return <tr key={item?.id}>
                            <td>{item?.name}</td>
                            <td>{getToday()}</td>
                            {updateStudents?.id !== item.id ? (
                                <td>
                                    {item.attendance?.at(-1) ? item.attendance?.at(-1)[1] : "Kiritilmagan"}
                                </td>
                            ) : (
                                <td>
                                    <select
                                        value={newattendance || ""}
                                        onChange={e => setNewattendance(e.target.value)}
                                    >
                                        <option value="">Kiritilmagan</option>
                                        <option value="Kelgan">Kelgan</option>
                                        <option value="Kelmagan">Kelmagan</option>
                                        <option value="Kechikgan">Kechikgan</option>
                                    </select>
                                </td>
                            )}
                            <td>{item?.lesson}</td>
                            <td>
                                {!updateStudents ? <button onClick={() => handleEdit(item?.id)}><FaPen /></button> : <button onClick={e => handleSave(item?.id)}>Saqlash</button>}
                            </td>
                            <td><button onClick={()=>navigate(`/oos/${item?.id}`)}>O'quvchi davomatini ko'rish</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </div>
}

export default Attendance;