import { forwardRef, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AddLessonModal.css";

const AddLessonModal = forwardRef(function AddLessonModal({ teacherId, onLessonAdded , errorRef} , ref) {
    const [lessonName, setLessonName] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e) {
        e.preventDefault();

        const name = lessonName.trim();

        if (!name) {
            errorRef.current.showModal()
            return;
        }

        if (!teacherId) {
            errorRef.current.showModal()
            return;
        }


        setLoading(true);

        try {
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
                errorRef.current.showModal()
                return;
            }

            const { data, error } = await supabase
                .from("lessons")
                .insert({
                    lesson: name,
                    teacher_id: teacherId,
                    disable_for: []
                })
                .select()
                .single();

            if (error) {
                throw error;
            }
            onLessonAdded(data);
            setLessonName("");
            ref.current?.close();
        } catch (error) {
            errorRef.current.showModal()
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
