import { useEffect, useRef, useState } from "react";

import LessonCard from "../components/LessonCard";
import AddLessonModal from "../components/AddLessonModal";

import "./Lessons.css";

import { supabase } from "../supabaseClient";


function Lessons() {

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teacherId, setTeacherId] = useState(null);

    const modal = useRef(null);


    // --------------------------------------------------
    // TEACHER ID
    // --------------------------------------------------

    function getTeacherId() {

        const savedTeacherId =
            localStorage.getItem("teacherID");

        if (!savedTeacherId) {
            return null;
        }

        try {
            return JSON.parse(savedTeacherId);
        } catch {
            return Number(savedTeacherId);
        }
    }


    // --------------------------------------------------
    // GURUHLARNI DATABASE'DAN OLISH
    // --------------------------------------------------

    async function loadLessons(currentTeacherId) {

        /*
            2 xil guruh mavjud:

            1. Global/default guruhlar
               teacher_id = null

            2. Teacher yaratgan guruhlar
               teacher_id = currentTeacherId
        */

        const { data, error } = await supabase
            .from("lessons")
            .select("*")
            .or(
                `teacher_id.is.null,teacher_id.eq.${currentTeacherId}`
            )
            .order("id", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        /*
            disable_for ichida teacher ID bo'lsa,
            shu teacherga guruh ko'rsatilmaydi.
        */

        const visibleLessons = (data || []).filter(
            lesson => {

                const disabledTeachers =
                    lesson.disable_for || [];


                return !disabledTeachers.includes(
                    currentTeacherId
                );
            }
        );


        setLessons(visibleLessons);
    }


    // --------------------------------------------------
    // PAGE YUKLANGANDA
    // --------------------------------------------------

    useEffect(() => {

        async function load() {

            try {

                const currentTeacherId =
                    getTeacherId();


                if (!currentTeacherId) {
                    alert("Avval login qiling");
                    return;
                }


                setTeacherId(currentTeacherId);

                await loadLessons(
                    currentTeacherId
                );

            } catch (error) {

                console.error(
                    "Guruhlarni olishda xatolik:",
                    error
                );

                alert(
                    "Guruhlarni yuklashda xatolik yuz berdi"
                );

            } finally {

                setLoading(false);

            }
        }


        load();

    }, []);


    // --------------------------------------------------
    // MODAL
    // --------------------------------------------------

    function handleShowModal() {
        modal.current?.showModal();
    }


    // --------------------------------------------------
    // YANGI GURUH QO'SHILDI
    // --------------------------------------------------

    function handleLessonAdded(newLesson) {

        setLessons(prevLessons => [
            ...prevLessons,
            newLesson
        ]);
    }


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {

        return (
            <div className="lessons-wrapper">
                <h2>
                    Guruhlar yuklanmoqda...
                </h2>
            </div>
        );
    }


    // --------------------------------------------------
    // PAGE
    // --------------------------------------------------

    return (
        <div className="lessons-wrapper">

            <div className="lessons-header">

                <h2>
                    Guruhlar
                </h2>


                <button
                    onClick={handleShowModal}
                    className="add-lesson-btn"
                >
                    + Guruh qo'shish
                </button>

            </div>


            <AddLessonModal
                ref={modal}
                teacherId={teacherId}
                onLessonAdded={handleLessonAdded}
            />


            <div className="lessons-list">

                <h2>
                    Guruhlar ro'yxati
                </h2>


                {lessons.length === 0 ? (

                    <p>
                        Hozircha guruhlar mavjud emas
                    </p>

                ) : (

                    lessons.map(lesson => (

                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                        />

                    ))

                )}

            </div>

        </div>
    );
}


export default Lessons;
 