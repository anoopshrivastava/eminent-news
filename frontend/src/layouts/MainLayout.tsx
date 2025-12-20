import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
// import Footer from '@/components/Footer';
// import Header2 from '@/components/Header2';
import Footer2 from '@/components/Footer2';
import MobileHeader from '@/components/MobileHeader';

export type Language = "en" | "hi";

const MainLayout = () => {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header/>
      <MobileHeader />
        <main className="flex-grow mt-12 md:mt-13">
          <Outlet />
        </main>
      <Footer2 />
    </div>
  );
};

export default MainLayout;
