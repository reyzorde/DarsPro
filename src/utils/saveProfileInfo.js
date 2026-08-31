import { supabase } from "../supabaseClient";

async function saveProfileInfo(update , modal) {
    try {
        let teacher_id = JSON.parse(localStorage.getItem("teacherID"));
        let { data, error } = await supabase.from("teachers").update({
            name: update.name,
            center: update.center,
            img_url: update.image_url
        }).eq("teacher_id", teacher_id).select().single();
        if (error || !data) {
            throw new Error(error);
        }
        return data;
    } catch (error) {
        modal.current.showModal()
    }
}

export default saveProfileInfo;