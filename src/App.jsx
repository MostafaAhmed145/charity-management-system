import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Door from "./COMPONENT/DOOR/Door";
import Login from "./COMPONENT/LOGIN/Login";
import Register from "./COMPONENT/REGISTER/Register";
import LayOute from "./COMPONENT/LayOute/LayOute";
import DashBoard from "./COMPONENT/DASH-BOARD/DashBoard";
import Cases from "./COMPONENT/CASES/Cases";
import MyCases from "./COMPONENT/MY-CASES/MyCases";
import ForgotPassword from "./COMPONENT/FORGOT-PASSWORD/ForgotPassword";
import Profile from "./COMPONENT/PROFILE/Profile";
import EditProfile from "./COMPONENT/EDIT-PROFILE/EditProfile";
import NotFound from "./COMPONENT/NOT-FOUND/NotFound";

import AuthProvider from "./COMPONENT/CONTEXT/Context";
import ProtectedRoute from "./COMPONENT/PROTECTED-ROUTE/ProtectedRoute";
import AdminRoute from "./COMPONENT/ADMIN-ROUTE/AdminRoute";
import UserHome from "./COMPONENT/USER-HOME/UserHome";
import SubmitCase from "./COMPONENT/SUBMIT-CASE/SubmitCase";
import Trash from "./COMPONENT/TRASH/Trash";
import SuperAdmin from "./COMPONENT/SUPER-ADMIN/SuperAdmin";
import SuperAdminRute from "./COMPONENT/SUPER-ADMIN-ROUTE/SuperAdminRute";

function Redirect({ to }) {
  return <Navigate to={to} replace />;
}

function App() {
  const myRoute = createBrowserRouter([
    {
      path: "/",
      element: <LayOute />,
      children: [
        {
          index: true,
          element: <Door />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "ForgotPassword",
          element: <Redirect to="/forgot-password" />,
        },

        {
          path: "user-home",
          element: (
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "userHome",
          element: <Redirect to="/user-home" />,
        },

        {
          path: "submit-case",
          element: (
            <ProtectedRoute>
              <SubmitCase />
            </ProtectedRoute>
          ),
        },
        {
          path: "submitCase",
          element: <Redirect to="/submit-case" />,
        },

        {
          path: "my-cases",
          element: (
            <ProtectedRoute>
              <MyCases />
            </ProtectedRoute>
          ),
        },
        {
          path: "myCases",
          element: <Redirect to="/my-cases" />,
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "Profile",
          element: <Redirect to="/profile" />,
        },
        {
          path: "edit-profile",
          element: (
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "editProfile",
          element: <Redirect to="/edit-profile" />,
        },

        {
          path: "dashboard",
          element: (
            <AdminRoute>
              <DashBoard />
            </AdminRoute>
          ),
          children: [
            {
              index: true,
              element: <Cases />,
            },
            {
              path: "cases",
              element: <Cases />,
            },
            {
              path: "trash",
              element: <Trash />,
            },
            {
              path: "super-admin",
              element: (
                <SuperAdminRute>
                  <SuperAdmin />
                </SuperAdminRute>
              ),
            },
            {
              path: "SuperAdmin",
              element: <Redirect to="/dashboard/super-admin" />,
            },
          ],
        },
        {
          path: "dashBoard",
          element: <Redirect to="/dashboard" />,
        },
        {
          path: "dashBoard/cases",
          element: <Redirect to="/dashboard/cases" />,
        },
        {
          path: "dashBoard/trash",
          element: <Redirect to="/dashboard/trash" />,
        },
        {
          path: "dashBoard/SuperAdmin",
          element: <Redirect to="/dashboard/super-admin" />,
        },

        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return (
    <>
      <AuthProvider>
        <RouterProvider router={myRoute} />
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          rtl
        />
      </AuthProvider>
    </>
  );
}

export default App;
