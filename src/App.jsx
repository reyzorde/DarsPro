import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Router from './router/Router';
import Login from './pages/Login';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Lessons from './pages/Lessons';
import Leads from './pages/Leads';
import Attendance from './pages/Attendance';
import OnlyOneStudent from './components/OnlyOneStudent';
import Profile from './pages/Profile';
import InCome from './pages/IncomePage';
import NotificationPage from './pages/NotificationPage';

function App() {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    {
      element: <Router />,
      children: [
        { path: "/", element: <Home />},
        { path: "/settings", element: <Settings/>},
        { path: "/lessons", element: <Lessons/>},
        { path: "/students", element: <Leads/>},
        {path:"/students/:lesson" , element: <Leads/>},
        {path:"/attendance" , element:<Attendance/>},
        {path:"/oos/:studentID" , element:<OnlyOneStudent/>},
        {path:"/profile" , element:<Profile/>},
        {path:"/payment" , element:<InCome/>},
        {path:"/notification" , element:<NotificationPage/>}
      ]
    }
  ])
  return <RouterProvider router={router}></RouterProvider>;
}

export default App
