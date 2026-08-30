import { supabase } from "../supabaseClient";
import getToday from "./getToday";

async function calculateDuePayments() {
    try {
        let teacher_id = JSON.parse(localStorage.getItem("teacherID"));
        if (!teacher_id) {
            alert("Iltimos avval hisobga kiring");
            return;
        }
        let { data, error } = await supabase.from("students").select("payment").eq("teacher_id", teacher_id);
        if (!data || error) {
            throw new Error(error)
        }
        let upcoming = [];
        let paid = [];
        let unpaid = [];
        let today = getToday();
    } catch (error) {
        alert(error)
    }
}

export default calculateDuePayments