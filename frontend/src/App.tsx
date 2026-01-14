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
import AllUsers from "./pages/admin/AllUsers";
import ProfilePage from "./pages/profile/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import NewsPage from "./pages/news/NewsPage";
import ShortsManager from "./pages/admin/Shorts";
import ShortsReel from "./pages/shorts/ShortReels";
import LandingPage from "./pages/landing-page/LandingPage";
import EditorShorts from "./pages/editor/EditorShorts";
import NewsDetail from "./pages/news-detail/NewsDetail";
import AdsPage from "./pages/admin/AdsPage";
import EditProfile from "./pages/profile/EditProfile";
import ChangePassword from "./pages/profile/ChangePassword";
import VideosManager from "./pages/admin/videos";
import UserAds from "./pages/user-ads/UserAds";
import VideosPage from "./pages/videos/Videos";
import VideoDetail from "./pages/videos/VideoDetailPage";
import Disclaimer from "./pages/disclaimer/Disclaimer";
import PrivacyPolicy from "./pages/privacy-policy/PrivacyPolicy";
import TermsAndConditions from "./pages/terms-condition/TermsAndCondition";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/:role" element={<SignupPage />} />
        <Route path="/" element={<LandingPage />} />

        {/* <Route element={<PrivateRoute />}> */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/shorts" element={<ShortsReel />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-condition" element={<TermsAndConditions />} />

            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/my-ads" element={<UserAds />} />
              <Route path="/settings/profile" element={<EditProfile />} />
              <Route path="/settings/security" element={<ChangePassword />} />

            </Route>
            
          </Route>
        {/* </Route> */}

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            
            <Route path="/admin/news" element={<AdminDashboard />} />
            <Route path="/admin/editors" element={<AllEditors />} />
            <Route path="/admin/users" element={<AllUsers />} />
            <Route path="/admin/shorts" element={<ShortsManager />} />
            <Route path="/admin/videos" element={<VideosManager />} />
            <Route path="/admin/ads" element={<AdsPage />} />
            
          </Route>
        </Route>

        {/* seller routes */}
        <Route element={<EditorRoute/>}>
          <Route element={<EditorLayout />}>
            <Route path="/editor/news" element={<EditorDashboard />} />
            <Route path="/editor/shorts" element={<EditorShorts />} />
            <Route path="/editor/videos" element={<VideosManager />} />
            <Route path="/editor/ads" element={<AdsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
