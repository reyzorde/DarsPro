function clock(){
let date = new Date();
let hour = String(date.getHours()).padStart(2 , "0");
let minut = String(date.getMinutes()).padStart(2 , "0");
let secund = String(date.getSeconds()).padStart(2 , "0");
let currentTime = `${hour}:${minut}:${secund}`
return currentTime;
}

export default clock