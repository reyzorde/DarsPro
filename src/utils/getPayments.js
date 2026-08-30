import getToday from "./getToday";

function getMonthlyPayments(students) {

    const today = getToday();

    const [day, month, year] = today.split(".").map(Number);

    const PAYMENT_DEADLINE = 10;


    let total = 0;
    let paid = 0;
    let expected = 0;
    let overdue = 0;


    for (const student of students) {

        const payments = student.payment || [];


        // Shu o'quvchining joriy oy to'lovi
        const currentMonthPayment = payments.find(payment => {

            const paymentDate = payment?.[0];

            if (!paymentDate) {
                return false;
            }

            const paymentMonth = Number(
                paymentDate.split(".")[1]
            );

            const paymentYear = Number(
                paymentDate.split(".")[2]
            );

            return (
                paymentMonth === month &&
                paymentYear === year
            );
        });


        // O'quvchining oylik to'lovi
        const amount = Number(
            String(
                currentMonthPayment?.[1] ||
                student.monthly_payment ||
                0
            ).replace(/\s/g, "")
        );


        // Agar summa mavjud bo'lmasa
        if (!amount) {
            continue;
        }


        // Shu oyning jami to'lovi
        total += amount;


        // Agar to'lov qilingan bo'lsa
        if (
            currentMonthPayment?.[2] === "To'langan"
        ) {
            paid += amount;
            continue;
        }


        // To'lov hali qilinmagan.
        // Endi muddatni tekshiramiz.

        if (day <= PAYMENT_DEADLINE) {

            // Muddat hali kelmagan
            expected += amount;

        } else {

            // Muddat o'tib ketgan
            overdue += amount;
        }
    }


    return [
        total.toLocaleString("ru-RU"),
        paid.toLocaleString("ru-RU"),
        expected.toLocaleString("ru-RU"),
        overdue.toLocaleString("ru-RU")
    ];
}


export default getMonthlyPayments;
