import { FaArrowAltCircleLeft, FaUser } from "react-icons/fa";
import "./Profile.css"
import { useNavigate } from "react-router-dom";
import Rules from "../components/Rules";
import { useEffect, useState } from "react";
import getInfo from "../utils/getprofileinfo";
import saveProfileInfo from "../utils/saveProfileInfo";

function Profile() {
    let navigate = useNavigate();
    const [isEdit, SetIsEdit] = useState(false);
    const [data, setData] = useState(null)
    const [name, setName] = useState("");
    const [center, setCenter] = useState("");
    const [imageURL, setImageURL] = useState("");
    useEffect(() => {
        async function loadInfo() {
            const result = await getInfo();
            setData(result);
        }

        loadInfo();
    }, []);

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

    async function handleSave() {
        if (!name || !center || !imageURL) {
            alert("To'ldirilmagan maydon mavjud");
            return;
        }
        try {
            let update = {
                name: name,
                center: center,
                image_url: imageURL
            }
            let newData = await saveProfileInfo(update);
            setData(newData);
            SetIsEdit(false);
            setCenter("");
            setName("")
            alert("Muvvafaqiyatli qo'shildi!")
        } catch (error) {
            console.log(error)
        }
    }

    return <div className="profile">
        <button onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
        <div className="profile-section1">
            <div className="profile-image">
                {data?.img_url ? <img src={data?.img_url} alt="User image" /> : <FaUser/>}
            </div>
            {!isEdit ? <div className="profile-about">
                <h2>{data ? data?.name : "Ism kiritilmagan"}</h2>
                <p>Markaz: {data ? data?.center : "Nom kiritilmagan"}</p>
                <button onClick={() => SetIsEdit(true)}>Tahrirlash</button>
            </div> : <div className="profile-edit-div">
                <input type="text" placeholder="Ismni tahrirlash" onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Markaz nomini Tahrirlash" onChange={(e) => setCenter(e.target.value)} />
                <input type="text" placeholder="Yangi rasm manzilini shu yerga qoying" onChange={(e) => setImageURL(e.target.value)} />
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