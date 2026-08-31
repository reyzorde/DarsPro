import { supabase } from "../supabaseClient";

async function getStudents() {
    try {
        let teacher_id = JSON.parse(localStorage.getItem("teacherID"));
        if(!teacher_id){
            throw new Error("Avval login qiling")
        }
        const {data , error} = await supabase.from('students').select("*").eq("teacher_id" , teacher_id);
        if (error || !data) {
            throw new Error(error)
        }
        return data || [];
    } catch (error) {
        return []
    }
}

export default getStudents;