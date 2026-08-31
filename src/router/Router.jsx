import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import "./Router.css";
import Clock from "../components/Clock";
import checkLogin from "../utils/checkLogin";

export default function Router() {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  let teacherID = JSON.parse(localStorage.getItem("teacherID"))

  if (!isLoggedIn && checkLogin(teacherID)) {
    localStorage.clear()
    return <Navigate to="/login" />;
  }

  return (
    <main className="router">
      <SideBar />

      <section className="router-content">
        <Clock/>
        <Outlet />
      </section>
    </main>
  );
}