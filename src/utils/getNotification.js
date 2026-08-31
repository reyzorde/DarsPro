import { supabase } from "../supabaseClient"

async function getNotifications() {
    try {
        let teacher_id = JSON.parse(localStorage.getItem("teacherID"))
        let {data , error} = await supabase.from("notification").select("title , message , created_at , id").eq("for_whom" , teacher_id);
        if(error || !data){
            throw new Error(error);
        }
        return data;
    } catch (error) {
        return [];
    }
}

export default getNotifications