import { useEffect, useState } from "react";
import { FaBell, FaPlus } from "react-icons/fa";
import "./Notification.css";
import NotificationCard from "../components/NotificationCard";
import AddNotification from "../components/AddNotification";
import getNotifications from "../utils/getNotification";

function NotificationPage() {
    const [showModal, setShowModal] = useState(false);

    const [notifications, setNotifications] = useState([]);
    async function load() {
        let data = await getNotifications()
        setNotifications(data.reverse())
    }
    useEffect(() => {
        load()
    }, [showModal])

    return (
        <div className="note-wrapper">

            {/* Header */}

            <div className="note-header">

                <div className="note-title">

                    <div className="note-title-icon">
                        <FaBell />
                    </div>

                    <div>
                        <h1>Xabarlar</h1>
                        <p>
                            Studentlarga yuborilgan barcha xabarlarni boshqaring
                        </p>
                    </div>

                </div>

                <button
                    className="add-note-btn"
                    onClick={() => setShowModal(true)}
                >
                    <FaPlus />
                    Xabar yuborish
                </button>

            </div>


            {/* Content */}

            <div className="note-content">

                <div className="note-list-header">

                    <div>
                        <h2>Yuborilgan xabarlar</h2>
                        <span>
                            Jami {notifications?.length} ta xabar
                        </span>
                    </div>

                </div>


                <div className="notification-list">

                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                            />
                        ))
                    ) : (
                        <div className="empty-notification">
                            <div className="empty-icon">
                                <FaBell />
                            </div>

                            <h3>Hali xabar yuborilmagan</h3>

                            <p>
                                Studentlarga birinchi xabaringizni yuboring.
                            </p>

                            <button
                                onClick={() => setShowModal(true)}
                            >
                                Xabar yuborish
                            </button>
                        </div>
                    )}

                </div>

            </div>


            {/* Modal */}

            {showModal && (
                <AddNotification
                    onClose={() => setShowModal(false)}
                />
            )}

        </div>
    );
}

export default NotificationPage;
