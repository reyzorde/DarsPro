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

        // -----------------------------------------
        // 1. To'lov summasini tekshirish
        // -----------------------------------------

        if (!payment.trim()) {
            alert("To'lov summasini kiriting");
            return;
        }


        // -----------------------------------------
        // 2. Studentni topish
        // -----------------------------------------

        const student = students.find(
            student => student.id === studentId
        );

        if (!student) {
            alert("O'quvchi topilmadi");
            return;
        }


        // -----------------------------------------
        // 3. Bugungi sana
        // -----------------------------------------

        const today = getToday();


        // -----------------------------------------
        // 4. Paymentlarni nusxalash
        //    Eski tarix o'chirilmaydi
        // -----------------------------------------

        const payments = Array.isArray(student.payment)
            ? [...student.payment]
            : [];


        // -----------------------------------------
        // 5. Bugungi oy va yil
        // -----------------------------------------

        const [
            todayDay,
            todayMonth,
            todayYear
        ] = today.split(".").map(Number);


        // -----------------------------------------
        // 6. Shu oy uchun paymentni qidiramiz
        // -----------------------------------------

        const currentPaymentIndex = payments.findIndex(
            item => {

                if (!item?.[0]) {
                    return false;
                }

                const [
                    day,
                    month,
                    year
                ] = item[0]
                    .split(".")
                    .map(Number);

                return (
                    month === todayMonth &&
                    year === todayYear
                );
            }
        );


        // -----------------------------------------
        // 7. To'lov summasi
        // -----------------------------------------

        const amount = payment.trim();


        // -----------------------------------------
        // 8. Shu oy uchun payment mavjud bo'lsa
        //    uni To'langan qilamiz
        // -----------------------------------------

        if (currentPaymentIndex !== -1) {

            payments[currentPaymentIndex] = [
                payments[currentPaymentIndex][0],
                amount,
                "To'langan"
            ];

        }


        // -----------------------------------------
        // 9. Shu oy uchun payment hali yo'q bo'lsa
        //    yangi payment yaratamiz
        // -----------------------------------------

        else {

            payments.push([
                today,
                amount,
                "To'langan"
            ]);
        }


        // -----------------------------------------
        // 10. Supabase'ga saqlash
        // -----------------------------------------

        const { data, error } = await supabase
            .from("students")
            .update({
                payment: payments
            })
            .eq("id", studentId)
            .select()
            .single();


        // -----------------------------------------
        // 11. Xatolik
        // -----------------------------------------

        if (error) {

            console.error(
                "Payment save error:",
                error
            );

            alert(
                "To'lovni saqlashda xatolik yuz berdi"
            );

            return;
        }


        // -----------------------------------------
        // 12. React state'ni yangilash
        // -----------------------------------------

        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === studentId
                    ? data
                    : student
            )
        );


        // -----------------------------------------
        // 13. Edit rejimidan chiqish
        // -----------------------------------------

        setEditingStudentId(null);

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
