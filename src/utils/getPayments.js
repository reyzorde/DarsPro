import getStudents from "./getStudents";
import getToday from "./getToday";

function getMonthlyPayments(){
let students = getStudents();
let date = getToday().split(".")[1];
if(!students){
    return 0;
}
let a = 0;
let b = 0;
let c = 0;
let res = 0;

for(let i = 0 ; i < students.length ; i++){
    const payments = students[i].payment
    for (let i = 0; i < payments.length; i++) {
    if(payments[i][0].split(".")[1] === date){
        let pay = Number(payments[i][1].split(" ").join("") || 0);
        if(payments[i][2] === "To'langan"){
            a += pay || 0;
        }else if(payments[i][2] === "To'lanmagan"){
            b+= pay;
        }else if(payments[i][2] === "Kechikgan"){
            c+=pay
        }
        res += pay || 0
    }else{
        continue;
    }
}
}


a = a.toLocaleString('ru-RU');
b = b.toLocaleString('ru-RU');
c = c.toLocaleString('ru-RU');
res = res.toLocaleString('ru-RU');
return [res , a , b , c];
}

export default getMonthlyPayments;