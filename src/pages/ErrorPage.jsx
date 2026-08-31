import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

function ErrorPage() {

    const navigate = useNavigate();

    return (
        <div className="error-page">

            <div className="error-page-card">

                <div className="error-page-icon">
                    <FaExclamationTriangle />
                </div>

                <h1>404</h1>

                <h2>Sahifa topilmadi</h2>

                <p>
                    Siz qidirayotgan sahifa mavjud emas yoki
                    o‘chirib yuborilgan bo‘lishi mumkin.
                </p>

                <button
                    className="error-page-btn"
                    onClick={() => navigate("/")}
                >
                    <FaArrowLeft />
                    Bosh sahifaga qaytish
                </button>

            </div>

        </div>
    );
}

export default ErrorPage;
