import { useState } from "react";
import "./Income.css"
import { FaArrowAltCircleLeft, FaPen, FaSave } from "react-icons/fa";
import getToday from "../utils/getToday";
import getStudents from "../utils/getStudents";
import getMonthlyPayments from "../utils/getPayments";
import { useNavigate } from "react-router-dom";

function InCome() {
    const [studentPayments, setStudentPayments] = useState(getStudents())

    const [isEdit, setIsEdit] = useState();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);

    function handleEdit(id) {
        if (!id) {
            alert("tahrirlash uchun o'quvchi tanlang");
            return;
        }
        let editing = studentPayments.find(item => item?.id === id);
        setPayment(editing?.payment?.at(-1)?.[1] ?? "")
        setIsEdit(id);
    }

    function handleSave(id) {
        let editing = studentPayments.find(item => item?.id === id);
        let notEditing = studentPayments.filter(item => item?.id !== id);
        let currentMonth = getToday().split(".")[1];
        if (payment) {
            let updateStudent = { ...editing, payment: [...editing.payment.filter(pay => pay[0].split(".")[1] !== currentMonth), [getToday(), String(payment), "To'langan"]] };
            localStorage.setItem("students", JSON.stringify([...notEditing, updateStudent]));
            setIsEdit([]);
            setPayment("")
            setStudentPayments([...notEditing, updateStudent])
        } else {
            alert("to'ldirilmagan maydon mavjud");
        }
    }


    return <div className="income-wrapper">
        <button onClick={() => navigate(-1)} className="back"><FaArrowAltCircleLeft/>Qaytish</button>
        <div className="income-header">
            <div className="income-header-name">
                <h1>To‘lovlar</h1>
                <p>O‘quvchilaringizning to‘lovlarini boshqaring va kuzating</p>
            </div>
            <div className="income-header-btn">
                <button className="premium">To'lov hisoboti</button>
            </div>
        </div>
        <div className="income-info">
            <div className="income-div1">
                <h2>Jami tushum</h2>
                <h2>{getMonthlyPayments()[0] || "0"}</h2>
            </div>
            <div className="income-div1">
                <h2>To'langan</h2>
                <h2>{getMonthlyPayments()[1] || "0"}</h2>
            </div>
            <div className="income-div1">
                <h2>Kutilyabdi</h2>
                <h2>{getMonthlyPayments()[2] || "0"}</h2>
            </div>
            <div className="income-div1">
                <h2>To'lanmayabdi</h2>
                <h2>{getMonthlyPayments()[3] || "0"}</h2>
            </div>
        </div>
        <div className="income-table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ISM</th>
                        <th>GURUH</th>
                        <th>SUMMA </th>
                        <th>TO'LOV SANASI</th>
                        <th>HOLAT</th>
                        <th>TAHRIRLASH</th>
                    </tr>
                </thead>
                <tbody>
                    {studentPayments.map(lead => {
                        return <tr key={lead?.id}>
                            <td>{lead?.name}</td>
                            <td>{lead?.lesson}</td>
                            <td>{isEdit === lead?.id ? <input type="text" placeholder="400 000" onChange={e => { setPayment(e.target.value) }} value={payment ?? ""} /> : lead?.payment?.at(-1)[1]}</td>
                            <td>{lead?.payment?.at(-1)[0]}</td>
                            <td>{lead?.payment?.at(-1)[2]}</td>
                            <td>{isEdit === lead?.id ? <button onClick={() => handleSave(lead?.id)}><FaSave /></button> : <button onClick={() => handleEdit(lead?.id)}><FaPen /></button>}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </div>
}

export default InCome;