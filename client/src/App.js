import React from "react";
import LoginRegister from "./pages/loginRegister";
import Chat from "./pages/chat";
import User from "./pages/user";
import Friends from "./pages/friends";
import NewGroup from "./pages/newGroup";
import Groupchats from "./pages/grounds";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import AuthProvider from "./contexts/authContext";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./App.css";
function App() {
  const location = useLocation();
  return (
    // <TransitionGroup>
    //   <CSSTransition timeout={300} classNames="fadeRoute" key={location.key}>
    <AuthProvider>
      <Routes location={location}>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/home" element={<Chat />} />
        <Route path="/friend" element={<Friends />} />
        <Route path="/user" element={<User />} />
        <Route path="/newGroup" element={<NewGroup />} />
        <Route path="/ground" element={<Groupchats />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </AuthProvider>
    // </CSSTransition>
    //</TransitionGroup>
  );
}

export default App;
