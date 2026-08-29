import "./PremiumModal.css"

function PremiumModal({message , ref}){
    return <dialog className="premium-modal" ref={ref}>
        <h1>Premium</h1>
        <p>{message} uchun premium versiya kerak lekin hozir premium versiya tayyor emas .</p>
        <p>O'ylaymizki siz buni tushunasiz.</p>
        <button onClick={()=>ref.current.close()}>Yopish</button>
    </dialog>
}

export default PremiumModal