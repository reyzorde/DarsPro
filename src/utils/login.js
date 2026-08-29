// import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

async function loginTeacher(login , password , navigate){
try {
    let {data , error} = await supabase.from("teachers").select("teacher_id").eq("login" , login).eq("password" , password).eq("role" , "teacher").single();
if(error || !data){
    throw new Error("Login yoki Parolda xatolik mavjud");
}
localStorage.setItem("isLoggedIn" , "true");
localStorage.setItem("teacherID" , `${JSON.stringify(data.teacher_id)}`)
navigate("/");

} catch (error) {
    alert(error.message);
}
}

export default loginTeacher;