// import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

async function loginTeacher(login , password){
    localStorage.setItem("loginData" , JSON.stringify({login:login , password:password}))
    // let navigate = useNavigate()
try {
    let {data , error} = await supabase.from("teachers").select("login , password , role").eq("login" , login).eq("password" , password).eq("role" , "teacher").maybeSingle();
if(error || !data){
    console.log(error)
    throw new Error("Login yoki Parolda xatolik mavjud");
}
// localStorage.setItem("isLogged" , "true");
alert("muvvafaqiyat")
console.log(data)
// navigate("/");

} catch (error) {
    alert(error.message);
}
}

export default loginTeacher;