import { useEffect, useState } from "react";
import "./AddLead.css";
import getToday from "../utils/getToday";
import handleSave from "../utils/saveStudent";
import { supabase } from "../supabaseClient";

function AddLead({ editor, leads, ref }) {
    const [lessons, setLessons] = useState([])
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [lesson, setLesson] = useState("");
    const [payment , setPayment] = useState("");

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


    function close() {
        setName("");
        setPhone("");
        setLesson("");

        ref.current.close();
    }

    async function handleAdd() {
        const cleanName = name.trim();
        const cleanPhone = phone.trim();

        if (!cleanName || !cleanPhone || !lesson || !Number(payment.split(" ").join(""))) {
            alert("Barcha ma'lumotlarni kiriting!");
            return;
        }

        const newStudent = {
            name: cleanName,
            phone: cleanPhone,
            date: getToday(),
            payment: [
                [getToday(), payment, "To'langan"]
            ],
            lesson,
            attendance: [
                [getToday(), "Kelgan"]
            ],
            is_active: true,
            id: Date.now(),
            teacher_id: JSON.parse(localStorage.getItem("teacherID"))
        };

        const savedStudent = await handleSave(newStudent);

        if (!savedStudent) {
            return;
        }

        editor([...leads, ...savedStudent]);

        close();
    }


    return (
        <dialog ref={ref}>

            <h2>Kimni qo'shamiz</h2>

            <input
                type="text"
                placeholder="Ism Familiya"
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Telefon raqam"
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />

            <input type="text" 
            placeholder="Oylik to'lov narxi" 
            value={payment} 
            onChange={e=>setPayment(e.target.value )}
            />

            <label htmlFor="lessons">
                Guruh turini tanlang
            </label>

            <select
                value={lesson}
                onChange={e => setLesson(e.target.value)}
                id="lessons"
            >
                <option value="">
                    Guruhni tanlang
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


            <button
                onClick={handleAdd}
            >
                Qo'shish
            </button>

            <button
                onClick={close}
            >
                Bekor qilish
            </button>

        </dialog>
    );
}

export default AddLead;