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
import AuthSuccess from "@/components/AuthSuccess";
import FlashCard from "@/pages/Flashcard";
import { useAuthStore } from "@/store/useAuthStore";
import LearnFlashcard from "@/pages/LearnFlashcard";
import Achievement from "@/pages/Achievement";
import QuizResult from "@/pages/QuizResult";
import TestAgain from "@/pages/Quiz/TestAgain";
import Vocabulary from "@/pages/Vocabulary";
import Quiz from "@/pages/Quiz";
import TopicDetail from "@/pages/TopicDetail";
import VocabularyBattle from "@/pages/VocabularyBattle";
import AddFlashcard from "@/pages/AddFlashcard";
import Test from "@/pages/TestPage";
import TestResult from "@/pages/TestPage/TestResult";
import BattleResult from "@/components/Battle/BattleResult";
import ListClass from "@/pages/Class/ListClass";
import ClassDetail from "@/pages/Class/ClassDetail";
import Members from "@/pages/Class/Members";
import SearchResults from "@/pages/SearchResults";
import NotificationPage from "@/pages/Notification";
// Component bảo vệ route yêu cầu xác thực

// Admin imports
import AdminLayout from "@/components/Admin/AdminLayout";
import AdminDashboard from "@/pages/Admin/Dashboard";
import AdminUsers from "@/pages/Admin/Users";
import AdminTopics from "@/pages/Admin/Topics";
import AdminVocabularies from "@/pages/Admin/Vocabularies";
import AdminAnalytics from "@/pages/Admin/Analytics";

function PrivateRoute({ children }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? children : <Navigate to="/accounts/login" replace />;
}

// Component bảo vệ route dành cho admin
function AdminRoute({ children }) {
  const { user, accessToken } = useAuthStore();
  
  if (!accessToken) {
    return <Navigate to="/accounts/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function GuestRoute({ children }) {
  const { accessToken, user } = useAuthStore();
  
  if (!accessToken) {
    return children;
  }
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Navigate to="/" replace />;
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
        path: "/achievement/:username",
        element: <Achievement />,
      },
      {
        path: "/library",
        element: <Library />,
      },
      {
        path:"/notification",
        element: <NotificationPage/>
      },
      {
        path: "/classes",
        element: <ListClass/>,
      },
      {
        path: "/classes/:classId",
        element: <ClassDetail />
      },
      {
        path: "/classes/:classId/members",
        element: <Members/>,
      },
      {
        path: "/savedVocabulary",
        element: <Library />,
      },
      {
        path: "/vocabulary",
        element: <Vocabulary />,
      },
      {
        path: "/vocabulary/topic/:topicId",
        element: <TopicDetail />,
      },
      {
        path: "/vocabulary/:word",
        element: <Vocabulary />,
      },
      {
        path: "/battle",
        element: <VocabularyBattle />,
      },
      {
        path: "/flashcard/:flashcardId",
        element: <FlashCard />,
      },
      {
        path: "/add-flashcard",
        element: <AddFlashcard />
      },
      {
        path:"/search-results",
        element: <SearchResults />
      }
    ],
  },

  // Admin Routes - Separate section with AdminGuard protection
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "topics",
        element: <AdminTopics />,
      },
      {
        path: "vocabularies",
        element: <AdminVocabularies />,
      },
      {
        path: "analytics",
        element: <AdminAnalytics />,
      },
    ],
  },

  // Battle result routes (outside of main layout)
  {
    path: "/battle/:roomId/result",
    element: (
      <PrivateRoute>
        <BattleResult />
      </PrivateRoute>
    ),
  },

  // Guest routes (authentication pages)
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

  // Standalone routes
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
    element: <FlashCard mode="detail" />,
  },
  {
    path: "/flashcard/:flashcardId/quiz",
    element: <Quiz />,
  },
  {
    path: "/flashcard/:flashcardId/quizResult",
    element: <QuizResult />,
  },
  {
    path: "/flashcard/:flashcardId/testAgain",
    element: <TestAgain/>
  },
  {
    path: "/vocabulary/topic/:topicId/Test",
    element: <Test/>
  },
  {
    path: "/vocabulary/topic/:topicId/TestResult",
    element: <TestResult/>
  },
  {
    path: "/vocabulary/topic/:topicId/Test",
    element: <Test/>
  },
  {
    path: "/vocabulary/topic/:topicId/TestResult",
    element: <TestResult/>
  }
]);

export default router;