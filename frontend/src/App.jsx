import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { LoginPage } from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import { HomePage } from "./pages/HomePage";
import { useEffect } from "react";
import { SearchPage } from "./pages/SearchPage";
import { ReviewPage } from "./pages/ReviewPage";
import { WelcomePage } from "./pages/WelcomePage";
import { RankPage } from "./pages/RankPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
      <Routes>
        <Route index element={!user ? <WelcomePage /> : <HomePage />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/reviews/:isbn"
          element={user ? <ReviewPage /> : <Navigate to="/" />}
        />
        <Route
          path="/search"
          element={user ? <SearchPage /> : <Navigate to="/" />}
        />
        <Route
          path="/ranking"
          element={user ? <RankPage /> : <Navigate to="/" />}
        />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
