import { supabase } from "../supabaseClient";

async function addNotification(obj){
try {
    let {data , error} = await supabase.from("notification").insert(obj).select();
    if(!data || error){
        throw new Error(error)
    }
    return data
} catch (error) {
    alert("Xatolik: " , error)
}
}

export default addNotification