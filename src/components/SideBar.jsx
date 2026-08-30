import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBook,
  FaCog,
  FaUserCheck,
} from "react-icons/fa";
import "./SideBar.css";

function SideBar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Dars Pro</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end>
          <FaHome />
          <span>Asosiy</span>
        </NavLink>

        <NavLink to="/students">
          <FaUsers />
          <span>O'quvchilar</span>
        </NavLink>

        <NavLink to="/lessons">
          <FaBook />
          <span>Darslar</span>
        </NavLink>
        
        <NavLink to="/attendance">
          <FaUserCheck/>
          <span>Davomat</span>
        </NavLink>

        <NavLink to="/settings">
          <FaCog />
          <span>Sozlamalar</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default SideBar;