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
import AuthSuccess from "@/components/AuthSuccess";
import FlashCard from "@/pages/Flashcard";
import { useAuthStore } from "@/store/useAuthStore";
import LearnFlashcard from "@/pages/LearnFlashcard";
import Achievement from "@/pages/Achievement";

import QuizResult from "@/pages/QuizResult";
import TestAgain from "@/pages/Quiz/TestAgain";
import Vocabulary from "@/pages/Vocabulary";
import VocabularyDetail from "@/components/Vocabulary/VocabularyDetail";  
import Quiz from "@/pages/Quiz";
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
        path: "/accounts/:userId",
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
        path: "/vocabulary",
        element: <Vocabulary />,
      },
      {
        path: "/vocabulary/:word",
        element: <Vocabulary />,
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
    element: <LearnFlashcard />,
  },
  {
    path: "/flashcard/:flashcardId/detail",
    element: <FlashCard mode="detail"/>
  },
  {
    path: "/flashcard/:flashcardId/quiz",
    element: <Quiz/>
  },
  {
    path: "/flashcard/:flashcardId/quizResult",
    element: <QuizResult/>
  },
    {
    path: "/flashcard/:flashcardId/testAgain",
    element: <TestAgain/>
  }
]);

export default router;