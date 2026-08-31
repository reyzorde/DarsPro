import { supabase } from "../supabaseClient";

async function checkLogin(teacherID){
    try {
        let {data , error} = supabase.from("teachers").eq("teacher_id" , teacherID).single();
        if(!data || error){
            return false;
        }
        if(data || !error){
            return true;
        }
    } catch (error) {
        alert(error)
    }
}

export default checkLogin