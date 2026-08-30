import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./Leads.css";
import AddLead from "../components/AddLead";
import Table from "../components/Table";
import { useNavigate, useParams } from "react-router-dom";
import Notification from "../components/Notification";
import getStudents from "../utils/getStudents";
import getToday from "../utils/getToday";
import { supabase } from "../supabaseClient";


function Leads() {
    const dialog = useRef(null);
    const navigate = useNavigate()
    const [showNotification, setShowNotification] = useState(false);
    const [lessons, setLessons] = useState([])

    const [students, setStudents] = useState([]);
    const [wlesson, setWlesson] = useState("");
    const [wpayment, setWpayment] = useState("");

    const [editing, setEditing] = useState(null);
    const { lesson } = useParams()
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function load() {
            let data = await getStudents();
            setStudents(Array.isArray(data) ? data : []);
        }
        load()
    }, [])
    useEffect(() => {
        async function loadLessons() {
            const teacherId = JSON.parse(
                localStorage.getItem("teacherID")
            );

            if (!teacherId) {
                return;
            }

            const { data, error } = await supabase.from("lessons").select("*").or(`teacher_id.eq.${teacherId},teacher_id.is.null`).order("id", { ascending: true });

            if (error) {
                console.error(error);
                return;
            }

            setLessons(data || []);
        }

        loadLessons();
    }, []);
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
        if (name === "payment") {
            setEditing({
                ...editing, payment: [...(editing.payment || []).filter(item => item[0].split(".")[1] !== today.split(".")[1]), [today, "0", value]]
            })
        } else {
            setEditing({
                ...editing,
                [name]: name === "isActive" ? value === "true" : value
            });
        }
    }

    async function handleSave() {

        if (!editing) {
            return;
        }


        // Ma'lumotlar to'liq kiritilganini tekshirish
        if (
            !editing?.name?.trim() ||
            !editing?.phone?.trim() ||
            !editing?.lesson?.trim() ||
            !Array.isArray(editing?.payment)
        ) {
            alert("Ma'lumotlarni to'liq kiriting!");
            return;
        }


        try {
            let teacherID = JSON.parse(localStorage.getItem("teacherID"))
            if (!teacherID) {
                alert("Iltimoz avval hisobingizga kiring");
                navigate("/login")
            }

            const { data, error } = await supabase
                .from("students")
                .update({
                    name: editing.name,
                    phone: editing.phone,
                    lesson: editing.lesson,
                    payment: editing.payment,
                    isActive: editing.isActive
                })
                .eq("id", editing.id).eq("teacher_id", teacherID).select().single();


            if (error) {
                throw error;
            }


            // Database'dan qaytgan yangilangan student
            // bilan React state'ni ham yangilaymiz

            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.id === editing.id
                        ? data
                        : student
                )
            );


            setEditing(null);

        } catch (error) {

            console.error(
                "O'quvchini yangilashda xatolik:",
                error
            );

            alert(
                error.message ||
                "O'quvchini yangilashda xatolik yuz berdi"
            );
        }
    }


    const filteredStudents = students.filter(student => {
        const searchText = search.toLowerCase().trim();

        // Qidiruv
        const matchesSearch =
            !searchText ||
            student?.name?.toLowerCase().includes(searchText) ||
            student?.phone?.toLowerCase().includes(searchText) ||
            student?.lesson?.toLowerCase().includes(searchText);

        // URL orqali kelgan lesson
        const matchesUrlLesson =
            !lesson ||
            lesson === "Hammasi" ||
            student?.lesson === lesson;

        // Select orqali tanlangan lesson
        const matchesLesson =
            !wlesson ||
            wlesson === "Hammasi" ||
            student?.lesson === wlesson;

        // To'lov holati
        const lastPayment = student?.payment?.at(-1);
        const paymentStatus = lastPayment?.[2];

        const matchesPayment =
            !wpayment ||
            wpayment === "Hammasi" ||
            paymentStatus === wpayment;

        return (
            matchesSearch &&
            matchesUrlLesson &&
            matchesLesson &&
            matchesPayment
        );
    });

    return (
        <div className="leads">
            {showNotification && <Notification title={"O'quvchi tahrirlanmoqda"} message={`${editing?.name || " "}ni tahrirlamoqchimisiz . O'ylaymizki bu to'lov haqidagi tahrirlash bo'ladi . `} />}
            <header className="leads-header">
                <div className="header-left">
                    <h2>O'quvchilar</h2>

                    <span className="student-count">
                        {filteredStudents.length} ta o'quvchi
                    </span>
                </div>

                <div className="header-btns">
                    <button onClick={() => navigate("/payment")}>To'lovlar</button>
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
                <div className="leads-filter">
                    <select
                        name="with-payment"
                        id="wpayment"
                        value={wpayment}
                        onChange={e => setWpayment(e.target.value)}
                    >
                        <option value="">
                            To'lov holati
                        </option>

                        <option value="To'langan">
                            To'langan
                        </option>

                        <option value="To'lanmagan">
                            To'lanmagan
                        </option>

                        <option value="Hammasi">
                            Hammasi
                        </option>
                    </select>
                </div>
                <div className="leads-filter">
                    <select
                        value={wlesson}
                        onChange={e => setWlesson(e.target.value)}
                    >
                        <option value="">
                            Guruhni tanlang
                        </option>

                        <option value="Hammasi">
                            Hammasi
                        </option>

                        {lessons.map(item => (
                            <option
                                key={item.id}
                                value={item.lesson}
                            >
                                {item.lesson}
                            </option>
                        ))}
                    </select>

                </div>
            </div>

            <AddLead
                editor={updateStudents}
                leads={students}
                ref={dialog}
            />

            <div className="table-wrapper">
                <Table
                    filteredStudents={filteredStudents}
                    handleChange={handleChange}
                    handleEdit={handleEdit}
                    editing={editing}
                    handleSave={handleSave}
                    setStudents={setStudents}
                />
            </div>

        </div>
    );
}

export default Leads;