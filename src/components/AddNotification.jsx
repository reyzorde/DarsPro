import { useState } from "react";
import {
    FaBell,
    FaTimes,
    FaPaperPlane,
    FaUsers
} from "react-icons/fa";
import addNotification from "../utils/addNotification";

function AddNotification({ onClose }) {

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        let teacher_id = JSON.parse(localStorage.getItem("teacherID"))

        if (!title.trim() || !message.trim()) {
            return;
        }

        addNotification({
            title: title.trim(),
            message: message.trim(),
            for_whom: teacher_id
        });
        setMessage("");
        setTitle("");
        onClose()
    };


    return (
        <div className="notification-modal-overlay">

            <div className="notification-modal">

                {/* Header */}

                <div className="notification-modal-header">

                    <div className="notification-modal-title">

                        <div className="notification-modal-icon">
                            <FaBell />
                        </div>

                        <div>
                            <h2>Xabar yuborish</h2>
                            <p>Barcha studentlarga yuboriladi</p>
                        </div>

                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* Form */}

                <form onSubmit={handleSubmit}>

                    <div className="notification-target">

                        <FaUsers />

                        <div>
                            <strong>Qabul qiluvchilar</strong>
                            <span>Barcha studentlar</span>
                        </div>

                    </div>


                    <div className="notification-form-group">

                        <label>
                            Xabar sarlavhasi
                        </label>

                        <input
                            type="text"
                            placeholder="Masalan: Yangi dars jadvali"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={80}
                        />

                    </div>


                    <div className="notification-form-group">

                        <label>
                            Xabar
                        </label>

                        <textarea
                            placeholder="Studentlarga yubormoqchi bo'lgan xabaringizni yozing..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            maxLength={500}
                        />

                        <div className="character-count">
                            {message.length}/500
                        </div>

                    </div>


                    {/* Footer */}

                    <div className="notification-modal-footer">

                        <button
                            type="button"
                            className="notification-cancel"
                            onClick={onClose}
                        >
                            Bekor qilish
                        </button>

                        <button
                            type="submit"
                            className="notification-send"
                            disabled={!title.trim() || !message.trim()}
                        >
                            <FaPaperPlane />
                            Yuborish
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddNotification;
