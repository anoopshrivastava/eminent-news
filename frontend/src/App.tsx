import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        {/* </Route> */}

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
