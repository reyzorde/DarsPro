import { useNavigate } from "react-router-dom";
import {  FaBell, FaRocket, FaUser } from "react-icons/fa"
import "./Home.css"
import PremiumModal from "../components/PremiumModal";
import logo from "../public/logo.png"
import { useRef } from "react";
import Clock from "../components/Clock";

function Home() {
    let navigate = useNavigate()
    const modal = useRef(false);

    return <div className="hemo-wrapper">
        <div className="home-div1">
            <img src={logo} alt="DarsPlus logo" width={80} height={80}/>
            <div className="home-profile">
                <button onClick={()=>navigate("/profile")}>Profil</button>
                <button onClick={()=>navigate("/notification")}><FaBell/></button>
            </div>
        </div>
        <div className="home-div2">
            <h2>Premium haqida</h2>
            <FaRocket />
            <p>Premium imkoniyatlardan foydalaning
                O‘qishingizni yangi bosqichga olib chiqing — qo‘shimcha kurslar, batafsil natijalar va maxsus imkoniyatlarga ega bo‘ling.
            </p>
            <button className="premium" onClick={()=>modal.current.showModal()}>Premium</button>
        </div>
        <div className="home-div3">
            <div className="home-info1">
                <h2>To'lovlarni nazorat qiling</h2>
                <p>
                    O‘quvchilaringizning to‘lovlarini boshqaring va kuzating. 
                    Oylik hisobotlarni tuzing . To'lovlarni rejalashtiring , yarating.
                </p>
                <button onClick={()=>navigate("/payment")}>Batafsil</button>
            </div>

            <div className="home-info2">
                <h2>O‘quvchilaringizni boshqaring</h2>
                <p>
                    O‘quvchilarning rivojlanishi, topshiriqlari va
                    natijalarini kuzating. Har bir o‘quvchi bilan ishlashni
                    osonlashtirib, ta’lim jarayonini yanada samarali qiling.
                </p>
                <button onClick={()=>navigate("/students")}>Batafsil</button>
            </div>

            <div className="home-info3">
                <h2>Dastur ichida AI dan foydalaning</h2>
                <p>
                    AI yordamida savollaringizga tezkor javob oling,
                    murakkab mavzularni sodda tushuning va o‘qish jarayonida
                    kerakli yordamni bir necha soniyada toping.
                </p>
                <button onClick={()=>modal.current.showModal()}>Batafsil</button>
        <PremiumModal ref={modal} message={"Bu funksiya"}/>
            </div>
        </div>
    </div>
}

export default Home;