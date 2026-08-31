import { useEffect, useRef, useState } from "react";

import LessonCard from "../components/LessonCard";
import AddLessonModal from "../components/AddLessonModal";

import "./Lessons.css";

import { supabase } from "../supabaseClient";
import ErrorModal from "../components/ErrorModal";


function Lessons() {

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teacherId, setTeacherId] = useState(null);

    const modal = useRef(null);
    const errorRef = useRef(false);

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

    async function loadLessons(currentTeacherId) {

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


    useEffect(() => {

        async function load() {

            try {

                const currentTeacherId =
                    getTeacherId();


                if (!currentTeacherId) {
                    errorRef.current.showModal()
                    return;
                }

                setTeacherId(currentTeacherId);
                await loadLessons(
                    currentTeacherId
                );
            } catch (error) {
                errorRef.current.showModal();
            } finally {
                setLoading(false);
            }
        }
        load();

    }, []);

    function handleShowModal() {
        modal.current?.showModal();
    }

    function handleLessonAdded(newLesson) {

        setLessons(prevLessons => [
            ...prevLessons,
            newLesson
        ]);
    }


    if (loading) {

        return (
            <div className="lessons-wrapper">
                <h2>
                    Guruhlar yuklanmoqda...
                </h2>
            </div>
        );
    }

    return (
        <div className="lessons-wrapper">

            <div className="lessons-header">

                <h2>
                    Guruhlar
                </h2>


                <button onClick={handleShowModal} className="add-lesson-btn">+ Guruh qo'shish</button>
            </div>
            <AddLessonModal
                ref={modal}
                teacherId={teacherId}
                onLessonAdded={handleLessonAdded}
                errorRef={errorRef}
            />
            <div className="lessons-list">
                <h2>Guruhlar ro'yxati</h2>
                {lessons.length === 0 ? (<p>Hozircha guruhlar mavjud emas</p>) : (lessons.map(lesson => (<LessonCard key={lesson.id} lesson={lesson} />)))}
            </div>
            <ErrorModal errorRef={errorRef} title={"Xatolik"}
                message={"Xatolik  yuz berdi . Iltimos birozdan so'ng qayta urinib ko'ring."}
            />
        </div>
    );
}


export default Lessons;
