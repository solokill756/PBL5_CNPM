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
// import StoryModal from '@/components/Story/StoryModal';

// Component bảo vệ route yêu cầu xác thực
function PrivateRoute({ children }) {
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
}

// Component bảo vệ route yêu cầu xác thực email
function EmailVerificationRoute({ children }) {
  const { auth } = useAuth();
  return auth?.user?.isVerified ? (
    children
  ) : (
    <Navigate to="/accounts/emailverification" replace />
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    // element: (
    //     // <PrivateRoute>
    //         {/* <EmailVerificationRoute> */}
    //             <DefaultLayout />
    //         {/* </EmailVerificationRoute> */}
    //     // </PrivateRoute>
    // ),
    element: (
      // <PrivateRoute>
      <DefaultLayout />
      // </PrivateRoute>
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
        path: "/direct",
        // element: <Direct />,
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
]);

export default router;
