// import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';
// import Footer from '@/components/Footer';
import Header2 from '@/components/Header2';
import Footer2 from '@/components/Footer2';

const MainLayout = () => {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header2 />
      <MobileHeader />
      {/* <div className="flex flex-1">
        <Sidebar /> */}
        <main className="flex-grow mt-12 md:mt-16">
          <Outlet />
        </main>
      <Footer2 />
      {/* </div> */}
    </div>
  );
};

export default MainLayout;
