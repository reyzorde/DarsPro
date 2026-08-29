import { supabase } from "../supabaseClient";

async function handleSave(student) {
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
        console.error("Save student error:", error);
        alert(error.message);
        return null;
    }
}

export default handleSave;
