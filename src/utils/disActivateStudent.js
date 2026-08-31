import { data } from "react-router-dom";
import { supabase } from "../supabaseClient";

async function disActivator(student_id , sitaut) {
    try {

        // Teacher ID
        const teacher_id = JSON.parse(
            localStorage.getItem("teacherID")
        );

        if (!teacher_id) {
            alert("Teacher topilmadi");
            return;
        }


        // Student mavjudligini tekshirish
        const { data: student, error: selectError } =
            await supabase
                .from("students")
                .select("id, name, is_active")
                .eq("id", student_id)
                .eq("teacher_id", teacher_id)
                .single();


        if (selectError) {
            throw selectError;
        }


        if (!student) {
            alert("O'quvchi topilmadi");
            return;
        }


        // Tasdiqlash
        const p = prompt(
            "Tasdiqlash uchun OK deb yozing"
        );


        if (p !== "OK") {
            alert("O'quvchi faolsizlantirilmadi.");
            return;
        }
        let is_active ;
        if(sitaut === "faol"){
            is_active = true;
        }else {
            is_active = false;
        }

        // Studentni faolsizlantirish
        const { data: updatedStudent, error: updateError } =
            await supabase
                .from("students")
                .update({
                    is_active: is_active
                })
                .eq("id", student_id)
                .eq("teacher_id", teacher_id)
                .select()
                .single();


        if (updateError) {
            throw updateError;
        }

        return updatedStudent;

    } catch (error) {

        alert(
            error?.message ||
            "O'quvchini faolsizlantirishda xatolik yuz berdi."
        );
    }
}

export default disActivator;
