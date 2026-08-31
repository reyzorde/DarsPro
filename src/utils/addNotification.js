import { supabase } from "../supabaseClient";

async function addNotification(obj , modal){
try {
    let {data , error} = await supabase.from("notification").insert(obj).select();
    if(!data || error){
        throw new Error(error)
    }
    return data
} catch (error) {
 modal.current.showModal();   
}
}

export default addNotification