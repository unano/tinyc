import { HiOutlineUsers } from "react-icons/hi";
import { BiMessageSquareDetail } from "react-icons/bi";
import {NavLink} from 'react-router-dom';
import "./navBar.scss"
const NavBar = () => {
    const classNameFunc = ({ isActive }) =>
      isActive ? "activeNavLink navLink" : "navLink";
  return (
    <div className="listSwitch">
      <NavLink className={classNameFunc} to="/friend">
        <HiOutlineUsers />
      </NavLink>
      <NavLink className={classNameFunc} to="/home">
        <BiMessageSquareDetail />
      </NavLink>
    </div>
  );
};

export default NavBar;

