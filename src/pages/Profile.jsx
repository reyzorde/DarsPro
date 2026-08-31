import { FaArrowAltCircleLeft, FaQuestionCircle, FaTelegramPlane, FaUser } from "react-icons/fa";
import "./Profile.css"
import { useNavigate } from "react-router-dom";
import Rules from "../components/Rules";
import { useEffect, useRef, useState } from "react";
import getInfo from "../utils/getprofileinfo";
import saveProfileInfo from "../utils/saveProfileInfo";
import ErrorModal from "../components/ErrorModal";

function Profile() {
    let navigate = useNavigate();
    let errorRef = useRef(false);
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
        localStorage.clear();
        navigate("/login");
        alert("Hisob muvvafaqiyatli o'chirildi");
    }

    async function handleSave() {
        if (!name || !center || !imageURL) {
            errorRef.current.showModal()
            return;
        }
        try {
            let update = {
                name: name,
                center: center,
                image_url: imageURL
            }
            let newData = await saveProfileInfo(update , errorRef);
            setData(newData);
            SetIsEdit(false);
            setCenter("");
            setName("")
        } catch (error) {
            errorRef.current.showModal()
        }
    }

    return <div className="profile">
        <button onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
        <div className="profile-section1">
            <div className="profile-image">
                {data?.img_url ? <img src={data?.img_url} alt="User image" /> : <FaUser />}
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
                <div className="profile-edit-btn">
                    <button className="profile-save" onClick={handleSave}>Saqlash</button>
                    <button onClick={() => SetIsEdit(false)} className="profile-undo">Bekor qilish</button>
                </div>
            </div>}
        </div>
        <Rules />
              <div className="help">

        <div className="help-icon">
          <FaQuestionCircle />
        </div>

        <div className="help-content">
          <h3>Yordam kerakmi?</h3>

          <p>
            Ilovaga kirishda muammo bo‘lsa yoki
            qanday foydalanishni bilmasangiz,
            biz bilan bog‘laning.
          </p>

          <a
            href="https://t.me/darspro_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="help-btn"
          >
            <FaTelegramPlane />

            <span>
              Telegram orqali yordam so‘rash
            </span>
          </a>
        </div>

      </div>
        <div className="profile-section3">
            <button onClick={handleOut}>Hisobdan chiqish</button>
            <button onClick={handleDelete}>Hisobni o'chirish</button>
        </div>
        <ErrorModal errorRef={errorRef} title={"To'ldirilmagan maydon"}
            message={"To'ldirilmagan maydon mavjud . Iltimos maydonlarni to'ldirilganligiga ishon hosil qilib birozdan so'ng qayta urining"}
        />
    </div>
}

export default Profile;