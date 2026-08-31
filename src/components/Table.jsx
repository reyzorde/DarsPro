import { useState } from "react";
import { FaPen, FaUser, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import getToday from "../utils/getToday";
import { supabase } from "../supabaseClient";

function Table({ filteredStudents, editing , setEditing, handleChange, handleEdit, handleSave, setStudents }) {
    const navigate = useNavigate();
    const [editingAttendance, setEditingAttendance] = useState(false);
    const [attendanceChanges, setAttendanceChanges] = useState({});
    function handleAttendanceChange(studentId, value) {
        setAttendanceChanges(prev => ({
            ...prev,
            [studentId]: value
        }));

    }
    async function handleAttendanceSave() {

        if (Object.keys(attendanceChanges).length === 0) {
            setEditingAttendance(false);
            return;
        }

        try {

            const today = getToday();

            const teacherId = JSON.parse(
                localStorage.getItem("teacherID")
            );

            if (!teacherId) {
                alert("Iltimos, avval hisobingizga kiring");
                navigate("/login");
                return;
            }
            for (const studentId of Object.keys(attendanceChanges)) {

                const newStatus = attendanceChanges[studentId];

                const student = filteredStudents.find(
                    item => String(item.id) === String(studentId)
                );

                if (!student) {
                    continue;
                }

                const oldAttendance = Array.isArray(student.attendance)
                    ? [...student.attendance]
                    : [];

                const todayIndex = oldAttendance.findIndex(
                    item => item?.[0] === today
                );

                let newAttendance;

                if (todayIndex !== -1) {

                    newAttendance = [...oldAttendance];

                    newAttendance[todayIndex] = [
                        today,
                        newStatus
                    ];

                }

                else {

                    newAttendance = [...oldAttendance, [today, newStatus]];

                }

                const { data, error } = await supabase
                    .from("students")
                    .update({
                        attendance: newAttendance
                    })
                    .eq("id", student.id)
                    .eq("teacher_id", teacherId)
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                setStudents(prevStudents =>
                    prevStudents.map(item =>
                        item.id === student.id
                            ? data
                            : item
                    )
                );

            }

            setAttendanceChanges({});
            setEditingAttendance(false);

        } catch (error) {

            console.error(
                "Davomatni saqlashda xatolik:",
                error
            );

            alert(
                error.message ||
                "Davomatni saqlashda xatolik yuz berdi"
            );
        }
    }


    return (
        <table className="students-table">

            <thead>

                <tr>

                    <th>
                        O'quvchilar
                    </th>

                    <th>
                        Dars turi
                    </th>

                    <th>
                        To'lov holati
                    </th>


                    {/* DAVOMAT USTUNI */}

                    <th>

                        <button
                            type="button"
                            className="column-edit-btn"
                            onClick={() => {

                                if (editingAttendance) {

                                    handleAttendanceSave();

                                } else {

                                    setEditingAttendance(true);

                                }

                            }}
                        >

                            {editingAttendance ? (
                                <>
                                    Saqlash
                                </>
                            ) : (
                                <>
                                    Davomat
                                </>
                            )}

                        </button>

                    </th>


                    <th>
                        O'quvchi holati
                    </th>

                    <th>
                        Tahrirlash
                    </th>

                    <th>
                        Sahifasi
                    </th>

                </tr>

            </thead>


            <tbody>

                {filteredStudents.map(lead => (

                    <tr key={lead.id} className={!lead.is_active ? "disabled-students" : ""}>

                        {/* ISM */}

                        <td className="student-name">

                            {editing?.id === lead.id ? (

                                <input
                                    type="text"
                                    name="name"
                                    value={editing?.name || ""}
                                    onChange={handleChange}
                                />

                            ) : (

                                lead?.name

                            )}

                        </td>

                        <td>

                            {editing?.id === lead.id ? (

                                <select
                                    name="lesson"
                                    value={editing?.lesson || ""}
                                    onChange={handleChange}
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

                            ) : (

                                `${lead.lesson} Guruhi`

                            )}

                        </td>


                        {/* TO'LOV */}

                        <td>
                            {lead?.payment?.at(-1)?.[2] || "Kiritilmagan"}
                        </td>

                        <td>

                            {editingAttendance ? (

                                <select
                                    value={
                                        attendanceChanges[lead.id] ??
                                        lead?.attendance?.at(-1)?.[1] ??
                                        ""
                                    }
                                    onChange={e =>
                                        handleAttendanceChange(
                                            lead.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Tanlang
                                    </option>
                                    <option value="Kelgan">
                                        Kelgan
                                    </option>
                                    <option value="Kelmagan">
                                        Kelmagan
                                    </option>
                                    <option value="Kechikgan">
                                        Kechikgan
                                    </option>
                                </select>
                            ) : (
                                lead?.attendance?.at(-1)?.[1] ||
                                "Kiritilmagan"
                            )}
                        </td>
                        <td>{lead.is_active ? "Faol" : "Nofaol"}</td>
                        <td>
                            {editing?.id === lead.id ? (
                                <div className="edit-btn">
                                    <button className="save-btn" onClick={handleSave}>
                                        Saqlash
                                    </button>
                                    <button className="save-btn" onClick={() => {
                                        setAttendanceChanges({});
                                        setEditingAttendance(false);
                                        setEditing(null)
                                    }}>
                                        Bekor qilish
                                        </button>
                                </div>
                            ) : (
                                <button className="edit-btn" onClick={() => handleEdit(lead.id)} disabled={!lead.is_active}>
                                    <FaPen />
                                </button>
                            )}
                        </td>
                        <td>
                            <button onClick={() => navigate(`/oos/${lead.id}`)} className="edit-btn">
                                <FaUser />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;
