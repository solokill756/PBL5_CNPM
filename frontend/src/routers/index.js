import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgetPass from "../pages/ForgetPass";
import DefaultLayout from "@/layouts/DefaultLayout";
import Profile from "@/pages/Profile";
import DefaultGuest from "@/layouts/DefaultGuest";
import Home from "@/pages/Home";
import EmailVerification from "@/pages/EmailVerification";
import Library from "@/pages/Library";
import Forum from "@/pages/Forum";
import Quiz from "@/pages/Quiz";
import AuthSuccess from "@/components/AuthSuccess";
import FlashCard from "@/pages/Flashcard";
import { useAuthStore } from "@/store/useAuthStore";
import Achievement from "@/pages/Achievement";


// Component bảo vệ route yêu cầu xác thực
function PrivateRoute({ children }) {
  // const { auth } = useAuth();
  const accessToken = useAuthStore(state => state.accessToken);

  return accessToken ? (
    children
  ) : (
    <Navigate to="/accounts/login" replace />
  );
}

// Component bảo vệ route dành cho khách
function GuestRoute({ children }) {
  const accessToken = useAuthStore(state => state.accessToken);
  return !accessToken ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
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
        path: "/accounts/:userId",
        element: <Profile />,
      },
      {
        path: "/achievement/:username",
        element: <Achievement />,
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
      {
        path: "/flashcard/:flashcardId",
        element: <FlashCard />
      }
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
    element: <AuthSuccess />,
  },
  {
    path: "/flashcard/:flashcardId/learn",
    // element: <LearnFlashcard />,
  },
  {
    path: "/flashcard/:flashcardId/detail",
    element: <FlashCard mode="detail"/>
  }
]);

export default router;
