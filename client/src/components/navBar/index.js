import { HiOutlineUsers } from 'react-icons/hi'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { MdOutlineGroupAdd } from 'react-icons/md'
import { FaCampground } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import './navBar.scss'
const NavBar = () => {
  const classNameFunc = (isActive, classN) =>
    isActive ? `activeNavLink navLink ${classN}` : `navLink ${classN}`
  return (
    <div className="listSwitch">
      <NavLink
        className={({ isActive }) => classNameFunc(isActive, 'nav1')}
        to="/friend"
      >
        <HiOutlineUsers />
      </NavLink>
      <NavLink
        className={({ isActive }) => classNameFunc(isActive, 'nav2')}
        to="/home"
      >
        <BiMessageSquareDetail />
      </NavLink>
      <NavLink
        className={({ isActive }) => classNameFunc(isActive, 'nav3')}
        to="/newGroup"
      >
        <MdOutlineGroupAdd />
      </NavLink>
      <NavLink
        className={({ isActive }) => classNameFunc(isActive, 'nav4')}
        to="/ground"
      >
        <FaCampground />
      </NavLink>
    </div>
  )
}

export default NavBar
