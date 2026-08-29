import { FaArrowAltCircleLeft } from "react-icons/fa";
import "./Profile.css"
import { useNavigate } from "react-router-dom";
import Rules from "../components/Rules";
import { useState } from "react";

function Profile() {
    let navigate = useNavigate();
    const [isEdit , SetIsEdit] = useState(false);
    const [data , setData] = useState(()=>{
        let profile = localStorage.getItem("profile");
        if(!profile){
            return [];
        }
         return JSON.parse(profile) || {}
    })
    const [name , setName] = useState("");
    const [center , setCenter] = useState("");
    const [imageURL , setImageURL] = useState("");

    function handleOut() {
        localStorage.setItem("isLoggedIn", "false");
        navigate("/login")
    }

    function handleDelete() {
        let password = prompt("Parolni kiriting");
        if (password === "s1r0j1dd1n") {
            let allow = prompt(`Tasdiqlash uchun "OK" ni yozing`);
            if (allow === "OK") {
                localStorage.clear();
                navigate("/login");
                alert("Hisob muvvafaqiyatli o'chirildi");
            } else {
                alert("Hisob o'chirilmadi");
            }
        } else {
            alert("Parol xato")
        }
    }

    function handleSave(){
        if(!name || !center || !imageURL){
            alert("To'ldirilmagan maydon mavjud");
            return;
        }
        let newData = {
            name:name,
            center:center,
            imageURL:imageURL,
            state:"3-toifa"
        }
        localStorage.setItem("profile" , JSON.stringify(newData));
        setData(newData);
        SetIsEdit(false);
        setCenter("");
        setName("")
        alert("Muvvafaqiyatli qo'shildi!")
    }

    return <div className="profile">
        <button onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
        <div className="profile-section1">
            <div className="profile-image">
                <img src={data ? data?.imageURL : "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"}  alt="User image"/>
            </div>
            {!isEdit ? <div className="profile-about">
                <h2>{data ? data?.name : "Ism kiritilmagan"}</h2>
                <p>Markaz: {data ?  data?.center : "Nom kiritilmagan"}</p>
                <p>Ta'rifi: {data ? data?.state : "Toifa berilmagan"}</p>
                <p>Keyingi to'lov: Bu toifada to'lov mavjud emas</p>
                <button onClick={()=>SetIsEdit(true)}>Tahrirlash</button>
            </div> : <div className="profile-edit-div">
                    <input type="text" placeholder="Ismni tahrirlash" onChange={(e)=>setName(e.target.value)}/>
                    <input type="text" placeholder="Markaz nomini Tahrirlash"  onChange={(e)=>setCenter(e.target.value)}/>
                    <input type="text" placeholder="Yangi rasm manzilini shu yerga qoying"  onChange={(e)=>setImageURL(e.target.value)}/>
                    <p>Ta'rifi: 3-toifa</p>
                    <p>Keyingi to'lov: Bu toifada to'lov mavjud emas.</p>
                    <button className="profile-save" onClick={handleSave}>Saqlash</button>
                </div>}
        </div>
        <Rules />
        <div className="profile-section3">
            <button onClick={handleOut}>Hisobdan chiqish</button>
            <button onClick={handleDelete}>Hisobni o'chirish</button>
        </div>
    </div>
}

export default Profile;