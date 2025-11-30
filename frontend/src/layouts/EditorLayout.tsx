import EditorSidebar from '../components/editor/Sidebar';
import { Outlet } from 'react-router-dom';

const EditorLayout = () => {
  return (
    <div className="flex min-h-screen">
      <EditorSidebar />
      <div className="flex-grow p-6 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default EditorLayout;
