import { useEffect, useRef, useState } from "react";
import "./Leads.css";
import AddLead from "../components/AddLead";
import Table from "../components/Table";
import { useNavigate, useParams } from "react-router-dom";
import getStudents from "../utils/getStudents";
import getToday from "../utils/getToday";
import { supabase } from "../supabaseClient";
import ErrorModal from "../components/ErrorModal";


function Leads() {
    const dialog = useRef(null);
    const navigate = useNavigate()
    const [lessons, setLessons] = useState([])

    const [students, setStudents] = useState([]);
    const [wlesson, setWlesson] = useState("");
    const [wpayment, setWpayment] = useState("");

    const [editing, setEditing] = useState(null);
    const { lesson } = useParams()
    const [search, setSearch] = useState("");
    const errorRef = useRef(false);

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

        if (
            !editing?.name?.trim() ||
            !editing?.phone?.trim() ||
            !editing?.lesson?.trim() ||
            !Array.isArray(editing?.payment)
        ) {
            errorRef.current.showModal()
            return;
        }


        try {
            let teacherID = JSON.parse(localStorage.getItem("teacherID"))
            if (!teacherID) {
                errorRef.current.showModal()
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
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.id === editing.id
                        ? data
                        : student
                )
            );


            setEditing(null);

        } catch (error) {
            errorRef.current.showModal()
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
                    setEditing={setEditing}
                    handleSave={handleSave}
                    setStudents={setStudents}
                />
            </div>
            <ErrorModal errorRef={errorRef} title={"Xatolik"} message={"Xatolik yuz berdi . Iltimos birozdan so'ng qayta urining."} />
        </div>
    );
}

export default Leads;