import { HiOutlineUsers, HiOutlineUser } from "react-icons/hi";
import {NavLink} from 'react-router-dom';
import "./navBar.scss"
const UserNavBar = () => {
    const classNameFunc = (isActive, classN) =>
      isActive ? `activeNavLink navLink ${classN}` : `navLink ${classN}`;
  return (
    <div className="userListSwitch">
      <NavLink
        className={({ isActive }) => classNameFunc(isActive, "nav2")}
        to="/user/users"
        replace={true}
      >
        <HiOutlineUser />
      </NavLink>
      <NavLink
        className={({ isActive }) => classNameFunc(isActive, "nav1")}
        to="/user/chats"
        replace={true}
      >
        <HiOutlineUsers />
      </NavLink>
    </div>
  );
};

export default UserNavBar;

