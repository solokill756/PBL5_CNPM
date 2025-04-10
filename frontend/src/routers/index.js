import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgetPass from "../pages/ForgetPass";
import DefaultLayout from "@/layouts/DefaultLayout";
import Profile from "@/pages/Profile";
import DefaultGuest from "@/layouts/DefaultGuest";
import Home from "@/pages/Home";
import EmailVerification from "@/pages/EmailVerification";
import useAuth from "@/hooks/useAuth";
import Library from "@/pages/Library";
import Forum from "@/pages/Forum";
import Quiz from "@/pages/Quiz";
import AuthSuccess from "@/components/AuthSuccess";

// Component bảo vệ route yêu cầu xác thực
function PrivateRoute({ children }) {
  const { auth } = useAuth();
  return auth?.accessToken ? (
    children
  ) : (
    <Navigate to="/accounts/login" replace />
  );
  const { auth } = useAuth();
  return auth?.accessToken ? (
    children
  ) : (
    <Navigate to="/accounts/login" replace />
  );
}

// Component bảo vệ route dành cho khách
function GuestRoute({ children }) {
  const { auth } = useAuth();
  return !auth?.accessToken ? children : <Navigate to="/" replace />;
  const { auth } = useAuth();
  return !auth?.accessToken ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DefaultLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/accounts/:username",
        element: <Profile />,
      },
      {
        path: "/library",
        element: <Library />,
      },
      {
        path: "/forum",
        element: <Forum />,
      },
      {
        path: "/quiz",
        element: <Quiz />,
      },
    ],
  },
  {
    path: "/accounts",
    element: (
      <GuestRoute>
        <DefaultGuest />
      </GuestRoute>
    ),
    children: [
      {
        index: true,
        element: <Login />,
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
        path: "forgetpass",
        element: <ForgetPass />,
      },
      {
        path: "emailverification",
        element: <EmailVerification />,
      },
    ],
  },
  {
    path: "/auth-success",
    element: <AuthSuccess />
  }
]);

export default router;
