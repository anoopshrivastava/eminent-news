import { ProfileDropdown } from './ProfileDropdown'
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  return (
    <div className='flex justify-between items-center px-4 pt-4 py-3 border-b-2 border shadow-lg'>
        <Link to="/">
          <img src={logo} alt="TEN Logo" className="h-9" />
        </Link>
        <ProfileDropdown name="Unknown"/>
    </div>
  )
}

export default MobileHeader