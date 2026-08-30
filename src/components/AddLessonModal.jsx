import { forwardRef, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AddLessonModal.css";

const AddLessonModal = forwardRef(function AddLessonModal(
    { teacherId, onLessonAdded },
    ref
) {
    const [lessonName, setLessonName] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e) {
        e.preventDefault();

        const name = lessonName.trim();

        if (!name) {
            alert("Guruh nomini kiriting");
            return;
        }

        if (!teacherId) {
            alert("Avval login qiling");
            return;
        }


        setLoading(true);

        try {

            // Shu teacherda xuddi shu nomli guruh borligini tekshiramiz
            const { data: existingLesson, error: checkError } =
                await supabase
                    .from("lessons")
                    .select("id")
                    .eq("teacher_id", teacherId)
                    .eq("lesson", name)
                    .maybeSingle();


            if (checkError) {
                throw checkError;
            }


            if (existingLesson) {
                alert("Bu guruh allaqachon mavjud");
                return;
            }


            // Yangi guruh yaratamiz
            // id ni yozmaymiz — Supabase o'zi beradi
            const { data, error } = await supabase
                .from("lessons")
                .insert({
                    lesson: name,
                    teacher_id: teacherId,

                    // Hozircha boshqa teacherlarga ko'rsatmaslik
                    disable_for: []
                })
                .select()
                .single();


            if (error) {
                throw error;
            }


            // Lessons.jsx ga yangi guruhni beramiz
            onLessonAdded(data);


            // Inputni tozalaymiz
            setLessonName("");


            // Modalni yopamiz
            ref.current?.close();

        } catch (error) {

            console.error(
                "Guruh qo'shishda xatolik:",
                error
            );

            alert("Guruh qo'shishda xatolik yuz berdi");

        } finally {

            setLoading(false);

        }
    }


    function handleClose() {
        setLessonName("");
        ref.current?.close();
    }


    return (
        <dialog
            ref={ref}
            className="add-lesson-modal"
        >

            <div className="add-lesson-content">

                <h2>Yangi guruh qo'shish</h2>

                <p>
                    Yangi guruh nomini kiriting
                </p>


                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Masalan: Matematika 1"
                        value={lessonName}
                        onChange={e =>
                            setLessonName(e.target.value)
                        }
                        autoFocus
                    />


                    <div className="add-lesson-buttons">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Bekor qilish
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Saqlanmoqda..."
                                : "Qo'shish"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </dialog>
    );
});

export default AddLessonModal;
