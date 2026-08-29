import { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./Leads.css";
import AddLead from "../components/AddLead";
import Table from "../components/Table";
import { useNavigate, useParams } from "react-router-dom";
import Notification from "../components/Notification";
import getStudents from "../utils/getStudents";
import getToday from "../utils/getToday";


function Leads() {
    const dialog = useRef(null);
    const navigate = useNavigate()
    const [showNotification , setShowNotification] = useState(false);

    const [students, setStudents] = useState(getStudents());

    const [editing, setEditing] = useState(null);
    const {lesson} = useParams()
    const [search, setSearch] = useState("");

    function updateStudents(newStudents) {
        setStudents(newStudents);

    }

    function handleEdit(id) {
        const password = prompt("Edit qilish uchun parolni kiriting:");

        if (password !== "s1r0j1dd1n") {
            alert("Parol noto'g'ri!");
            return;
        }
        setShowNotification(true)
        setTimeout(() => {
            setShowNotification(false)
        }, 3000);

        const student = students.find(
            student => student.id === id
        );

        if (!student) {
            return;
        }

        setEditing({
            ...student
        });
    }

    function handleChange(event) {
        const { name, value } = event.target;
        let today = getToday();
        if(name === "payment"){
            setEditing({
                ...editing , payment:[...editing.payment.filter(item => item[0].split(".")[1] !== today.split(".")[1]) , [today , "0" , value]]
            })
        }else{
            setEditing({
            ...editing,
            [name]: name === "isActive" ? value === "true" : value
        });
        }
    }

    function handleSave() {
        if (!editing) {
            return;
        }

        if (
            !editing?.name?.trim() ||
            !editing?.phone?.trim() ||
            !editing?.lesson?.trim() ||
            !editing?.payment
        ) {
            alert("Ma'lumotlarni to'liq kiriting!");
            return;
        }

        const updatedStudents = students.map(student => {
            if (student.id === editing.id) {
                return editing;
            }

            return student;
        });

        updateStudents(updatedStudents);
        setEditing(null);
    }

    const filteredStudents = students.filter(student => {
        let text = (lesson || search).toLowerCase();

        return (
            student.name.toLowerCase().includes(text) ||
            student.phone.toLowerCase().includes(text) ||
            student.lesson.toLowerCase().includes(text)
        );
    });
    return (
        <div className="leads">
            {showNotification && <Notification title={"O'quvchi tahrirlanmoqda"} message={`${editing?.name || " "}ni tahrirlamoqchimisiz . O'ylaymizki bu to'lov haqidagi tahrirlash bo'ladi . `}/>}
            <header className="leads-header">
                <div className="header-left">
                    <h2>O'quvchilar</h2>

                    <span className="student-count">
                        {students.length} ta o'quvchi
                    </span>
                </div>

                <div className="header-btns">
                    <button onClick={()=>navigate("/payment")}>To'lovlar</button>
                    <button
                        className="add-btn"
                        onClick={() => dialog.current.showModal()}
                    >
                        Qo'shish
                    </button>
                </div>
            </header>

            <div className="leads-search">
                <input
                    type="text"
                    placeholder="Kimni qidiramiz"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    id="search"
                />

                <label htmlFor="search">
                    <FaSearch />
                </label>
            </div>

            <AddLead
                editor={updateStudents}
                leads={students}
                ref={dialog}
            />

            <div className="table-wrapper">
                <Table filteredStudents={filteredStudents} handleChange={handleChange} handleEdit={handleEdit} editing={editing} handleSave={handleSave} />
            </div>

        </div>
    );
}

export default Leads;