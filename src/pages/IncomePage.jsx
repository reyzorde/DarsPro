import { useEffect, useState } from "react";
import { FaArrowAltCircleLeft, FaPen, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./Income.css";

import getToday from "../utils/getToday";
import getStudents from "../utils/getStudents";
import getMonthlyPayments from "../utils/getPayments";
import { supabase } from "../supabaseClient";


function InCome() {
    const navigate = useNavigate();

    // O'quvchilar ro'yxati
    const [students, setStudents] = useState([]);

    // Hozir qaysi o'quvchi tahrir qilinayotganini saqlaydi
    const [editingStudentId, setEditingStudentId] = useState(null);

    // Tahrirlash vaqtida kiritilayotgan to'lov summasi
    const [payment, setPayment] = useState("");

    // Ma'lumot yuklanayotganini bildiradi
    const [loading, setLoading] = useState(true);


    // --------------------------------------------------
    // O'QUVCHILARNI SUPABASE'DAN OLISH
    // --------------------------------------------------

    useEffect(() => {
        async function loadStudents() {
            try {
                const data = await getStudents();

                setStudents(data || []);
            } catch (error) {
                console.error("O'quvchilarni olishda xatolik:", error);
            } finally {
                setLoading(false);
            }
        }

        loadStudents();
    }, []);


    // --------------------------------------------------
    // TAHRIRLASHNI BOSHLASH
    // --------------------------------------------------

    function handleEdit(student) {
        // O'quvchining oxirgi to'lovini olamiz
        const lastPayment = student.payment?.at(-1);

        // Input ichida oxirgi to'lov summasi ko'rinadi
        setPayment(lastPayment?.[1] || "");

        // Shu o'quvchini tahrirlash rejimiga o'tkazamiz
        setEditingStudentId(student.id);
    }


    // --------------------------------------------------
    // TO'LOVNI SAQLASH
    // --------------------------------------------------

    async function handleSave(studentId) {

        // To'lov summasi kiritilganligini tekshiramiz
        if (!payment.trim()) {
            alert("To'lov summasini kiriting");
            return;
        }

        // Kerakli o'quvchini topamiz
        const student = students.find(
            student => student.id === studentId
        );

        if (!student) {
            alert("O'quvchi topilmadi");
            return;
        }


        // Bugungi sana
        const today = getToday();

        // Joriy oy
        const currentMonth = today.split(".")[1];


        // O'quvchining eski to'lovlaridan
        // joriy oyga tegishlisini olib tashlaymiz
        const oldPayments = (student.payment || []).filter(
            item => item[0].split(".")[1] !== currentMonth
        );


        // Yangi to'lovni qo'shamiz
        const updatedPayments = [
            ...oldPayments,
            [
                today,
                String(payment),
                "To'langan"
            ]
        ];


        // Supabase'da o'quvchining payment ustunini yangilaymiz
        const { data, error } = await supabase
            .from("students")
            .update({
                payment: updatedPayments
            })
            .eq("id", studentId)
            .select()
            .single();


        // Agar xatolik bo'lsa
        if (error) {
            console.error(error);

            alert("To'lovni saqlashda xatolik yuz berdi");
            return;
        }


        // Ekrandagi ma'lumotni ham yangilaymiz
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === studentId
                    ? data
                    : student
            )
        );


        // Tahrirlash rejimidan chiqamiz
        setEditingStudentId(null);

        // Inputni tozalaymiz
        setPayment("");
    }


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="income-wrapper">
                <h2>Ma'lumotlar yuklanmoqda...</h2>
            </div>
        );
    }


    // --------------------------------------------------
    // PAGE
    // --------------------------------------------------

    return (
        <div className="income-wrapper">

            {/* Orqaga qaytish */}
            <button
                onClick={() => navigate(-1)}
                className="back"
            >
                <FaArrowAltCircleLeft />
                Qaytish
            </button>


            {/* PAGE HEADER */}
            <div className="income-header">

                <div className="income-header-name">
                    <h1>To‘lovlar</h1>

                    <p>
                        O‘quvchilaringizning to‘lovlarini
                        boshqaring va kuzating
                    </p>
                </div>


                <div className="income-header-btn">
                    <button className="premium">
                        To'lov hisoboti
                    </button>
                </div>

            </div>


            {/* TO'LOV STATISTIKASI */}
            <div className="income-info">

                <div className="income-div1">
                    <h2>Jami tushum</h2>
                    <h2>
                        {getMonthlyPayments(students)[0] || "0"}
                    </h2>
                </div>


                <div className="income-div1">
                    <h2>To'langan</h2>
                    <h2>
                        {getMonthlyPayments(students)[1] || "0"}
                    </h2>
                </div>


                <div className="income-div1">
                    <h2>Kutilayotgan</h2>
                    <h2>
                        {getMonthlyPayments(students)[2] || "0"}
                    </h2>
                </div>


                <div className="income-div1">
                    <h2>To'lanmagan</h2>
                    <h2>
                        {getMonthlyPayments(students)[3] || "0"}
                    </h2>
                </div>

            </div>


            {/* O'QUVCHILAR VA TO'LOVLAR */}
            <div className="income-table-wrapper">

                <table>

                    <thead>
                        <tr>
                            <th>ISM</th>
                            <th>GURUH</th>
                            <th>SUMMA</th>
                            <th>TO'LOV SANASI</th>
                            <th>HOLAT</th>
                            <th>TAHRIRLASH</th>
                        </tr>
                    </thead>


                    <tbody>

                        {students.map(student => {

                            // O'quvchining oxirgi to'lovi
                            const lastPayment =
                                student.payment?.at(-1);


                            // Shu o'quvchi hozir tahrir qilinyaptimi?
                            const isEditing =
                                editingStudentId === student.id;


                            return (
                                <tr key={student.id}>

                                    {/* ISM */}
                                    <td>
                                        {student.name}
                                    </td>


                                    {/* GURUH */}
                                    <td>
                                        {student.lesson}
                                    </td>


                                    {/* TO'LOV SUMMASI */}
                                    <td>

                                        {isEditing ? (

                                            <input
                                                type="text"
                                                placeholder="400 000"
                                                value={payment}
                                                onChange={e =>
                                                    setPayment(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        ) : (

                                            lastPayment?.[1] || "0"

                                        )}

                                    </td>


                                    {/* TO'LOV SANASI */}
                                    <td>
                                        {lastPayment?.[0] || "-"}
                                    </td>


                                    {/* TO'LOV HOLATI */}
                                    <td>
                                        {lastPayment?.[2] || "To'lanmagan"}
                                    </td>


                                    {/* TAHRIRLASH / SAQLASH */}
                                    <td>

                                        {isEditing ? (

                                            <button
                                                onClick={() =>
                                                    handleSave(student.id)
                                                }
                                            >
                                                <FaSave />
                                            </button>

                                        ) : (

                                            <button
                                                onClick={() =>
                                                    handleEdit(student)
                                                }
                                            >
                                                <FaPen />
                                            </button>

                                        )}

                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


export default InCome;
