import {
    FaBell,
    FaUsers,
    FaClock
} from "react-icons/fa";

function NotificationCard({ notification }) {
    function note_date(){
        let data = notification.created_at.split("T")[0];
        let created_time = notification.created_at.split("T")[1];
        let old_time = created_time.split(".")[0];
        let hour = Number(old_time.split(":")[0])+5;
        let minut = old_time.split(":")[1];
        let time = `${hour}:${minut}`
        return [data , time]
    }

    return (
        <div className="notification-card">

            <div className="notification-card-icon">
                <FaBell />
            </div>


            <div className="notification-card-body">

                <div className="notification-card-top">

                    <h3>
                        {notification.title}
                    </h3>

                    <span className="notification-status">
                        Yuborilgan
                    </span>

                </div>


                <p className="notification-message">
                    {notification.message}
                </p>


                <div className="notification-meta">

                    <span>
                        <FaUsers />
                        Barcha studentlar
                    </span>

                    <span>
                        <FaClock />
                        {note_date()[0]} | {note_date()[1]}
                    </span>

                </div>

            </div>

        </div>
    );
}

export default NotificationCard;
