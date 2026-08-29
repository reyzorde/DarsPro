import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import "./Router.css";

export default function Router() {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="router">
      <SideBar />

      <section className="router-content">
        <Outlet />
      </section>
    </main>
  );
}