import { supabase } from "../supabaseClient"

async function getInfo() {
    try {
        let teacher_id = JSON.parse(localStorage.getItem("teacherID"));
        let { data, error } = await supabase.from("teachers").select("name , center , img_url").eq("teacher_id", teacher_id).single();
        if (error || !data) {
            throw new Error("Olib bo'lmadi")
        }
        return data;
    } catch (error) {
        console.log(error)
    }
}

export default getInfo