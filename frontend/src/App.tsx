import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
// import PrivateRoute from "./components/PrivateRoute";
import SignupPage from "./pages/signup/SignupPage";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./layouts/AdmintLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllEditors from "./pages/admin/AllEditors";
import EditorRoute from "./components/editor/EditorRoute";
import EditorLayout from "./layouts/EditorLayout";
import EditorDashboard from "./pages/editor/EditorDashboard";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/:role" element={<SignupPage />} />

        {/* <Route element={<PrivateRoute />}> */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        {/* </Route> */}

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            
            <Route path="/admin/news" element={<AdminDashboard />} />
            <Route path="/admin/editors" element={<AllEditors />} />
            {/* <Route path="/admin/users" element={<AllUsers />} /> */}
            {/* <Route path="/admin/orders" element={<AllOrders />} /> */}
            
          </Route>
        </Route>

        {/* seller routes */}
        <Route element={<EditorRoute/>}>
          <Route element={<EditorLayout />}>
            <Route path="/editor/news" element={<EditorDashboard />} />
            {/* <Route path="/seller/orders" element={<AllSellerOrders />} /> */}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
