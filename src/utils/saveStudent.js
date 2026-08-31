import { supabase } from "../supabaseClient";

async function handleSave(student , modal) {
    try {
        const { data, error } = await supabase
            .from("students")
            .insert(student)
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
            alert(error.message);
            return null;
        }

        return data;

    } catch (error) {
        modal.current.showModal();
        return null;
    }
}

export default handleSave;
