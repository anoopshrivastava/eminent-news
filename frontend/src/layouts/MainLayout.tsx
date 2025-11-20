import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';
import Footer from '@/components/Footer';

const MainLayout = () => {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <MobileHeader />
      {/* <div className="flex flex-1">
        <Sidebar /> */}
        <main className="flex-grow mx-4 md:mx-20 mt-2">
          <Outlet />
        </main>
      <Footer />
      {/* </div> */}
    </div>
  );
};

export default MainLayout;
