import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OOS.css";
import getStudents from "../utils/getStudents";
import { FaUser } from "react-icons/fa";
import disActivator from "../utils/disActivateStudent";
import ErrorModal from "./ErrorModal";

function OnlyOneStudent() {
    const { studentID } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const errorRef = useRef(false);

    useEffect(() => {
        async function loadStudent() {
            try {
                const students = await getStudents();

                const foundStudent = students?.find(
                    item => String(item.id) === String(studentID)
                );

                setStudent(foundStudent || null);
            } catch (error) {
                errorRef.current.showModal()
                setStudent(null);
            } finally {
                setLoading(false);
            }
        }

        loadStudent();
    }, [studentID]);

    if (loading) {
        return (
            <div className="oos-not">
                <h2>Yuklanmoqda...</h2>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="oos-not">
                <h2>Iltimos o'quvchini tanlab kiring</h2>
                <button onClick={() => navigate(-1)}>
                    Qaytish
                </button>
            </div>
        );
    }

    return (
        <div className="oos">
            <div className="oos-header">
                <button onClick={() => navigate(-1)}>
                    Qaytish
                </button>
            </div>

            <div className="student-info">
                <div className="student-img">
                    <FaUser />
                </div>
                <div className="student-texts">
                    <h2>Ism: {student?.name}</h2>
                    <h2>Aloqa operatori:{student?.phone}</h2>
                    <h2>Kelgan vaqti: {student?.date}</h2>
                    <h2>To'lov:{student?.payment?.at(-1)[1]}</h2>
                    <h2>So'ngi to'lov sanasi:{student?.payment?.at(-1)[0]}</h2>
                    <h2>To'lov holati: {student?.payment?.at(-1)[2]}</h2>
                </div>
            </div>
            <div className="student-tables">
                <table className="payments">
                    <thead>
                        <tr>
                            <th>To'lov sanasi</th>
                            <th>To'lov summasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.payment ? student.payment.map(item => {
                            return <tr key={item[0]}>
                                <td>{item[0]}</td>
                                <td>{item[1]}</td>
                            </tr>
                        }) : <tr>
                            <td colSpan="2">
                                To'lov hali kiritilmagan
                            </td>
                        </tr>}
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Davomat sanasi</th>
                            <th>Davomat holat</th>
                        </tr>
                    </thead>

                    <tbody>
                        {student.attendance?.length > 0 ? (
                            student.attendance.map((item, index) => (
                                <tr key={`${item[0]}-${index}`}>
                                    <td>{item[0]}</td>
                                    <td>{item[1]}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">
                                    Davomat hali kiritilmagan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {student?.is_active ? <button className="oos-btn deactivate-btn" onClick={() => disActivator(studentID, "faolsiz" , errorRef)}>O'quvchi faolsizlantirish</button> : <button className="oos-btn activate-btn" onClick={() => disActivator(studentID, "faol" , errorRef)}>O'quvchini faollashtirish</button>}
            <ErrorModal errorRef={errorRef} title={"Xatolik"} message={"Xatolik yuz berdi . Iltimos birozdan so'ng qayta urinib ko'ring"}/>
        </div>
    );
}

export default OnlyOneStudent;
