import { supabase } from "../supabaseClient";

function getStudents() {
    try {
        const savedStudents = supabase.from('students').select('*');
        if (savedStudents.body) {
            return JSON.parse(savedStudents);
        }
        return [];
    } catch (error) {
        alert(error.message)
    }
}

export default getStudents;