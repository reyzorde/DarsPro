import { useState } from "react";
import "./AddLead.css";
import getToday from "../utils/getToday";

function AddLead({ editor, leads, ref }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [lesson, setLesson] = useState("");

    function close() {
        setName("");
        setPhone("");
        setLesson("");

        ref.current.close();
    }

    function handleAdd() {
        const cleanName = name.trim();
        const cleanPhone = phone.trim();

        if (!cleanName || !cleanPhone || !lesson) {
            alert("Barcha ma'lumotlarni kiriting!");
            return;
        }


        const newStudent = {
            name: cleanName,
            phone: cleanPhone,
            date: getToday(),
            payment: [[getToday() , "Biriktirilmagan" , "To'langan"]],
            lesson: lesson,
            attendance:[[getToday() , "Kelgan"]],
            isActive:true,
            id: Date.now(),
            teacherID:0
        };

        const newStudents = [
            ...leads,
            newStudent
        ];

        editor(newStudents);

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

            <label htmlFor="lessons">
                Guruh turini tanlang
            </label>

            <select
                name="lessons"
                id="lessons"
                value={lesson}
                onChange={e => setLesson(e.target.value)}
            >
                <option value="">
                    Tanlang
                </option>

                <option value="Matematika">
                    Matematika
                </option>

                <option value="Fizika">
                    Fizika
                </option>

                <option value="SAT">
                    SAT
                </option>

                <option value="Ingliz-tili">
                    Ingliz-tili
                </option>

                <option value="Biologiya">
                    Biologiya
                </option>

                <option value="Kimyo">
                    Kimyo
                </option>
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