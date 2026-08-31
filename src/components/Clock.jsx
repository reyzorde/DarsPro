import { useEffect, useState } from "react"
import clock from "../utils/clock";
import getToday from "../utils/getToday";
import "./Clock.css"

function Clock(){
    const [time , setTime] = useState("");
    useEffect(()=>{
       const interval = setInterval(()=>setTime(clock()) , 1000);
       return ()=> clearInterval(interval)
    } , [])
 return <div className="clock">
    <h2>{getToday()}</h2>
    <h2>
        {time}
    </h2>
 </div>
}

export default Clock