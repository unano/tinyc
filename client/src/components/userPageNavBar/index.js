import { HiOutlineUsers } from 'react-icons/hi'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { NavLink } from 'react-router-dom'
import './navBar.scss'
const UserNavBar = () => {
  const classNameFunc = (isActive, classN) =>
    isActive ? `activeNavLink navLink ${classN}` : `navLink ${classN}`
  return (
    <div className="userListSwitch">
      <NavLink
        className={({ isActive }) => classNameFunc(isActive, 'nav2')}
        to="/user/users"
        replace={true}
      >
        <HiOutlineUsers />
      </NavLink>
      <NavLink
        className={({ isActive }) => classNameFunc(isActive, 'nav1')}
        to="/user/chats"
        replace={true}
      >
        <BiMessageSquareDetail />
      </NavLink>
    </div>
  )
}

export default UserNavBar
