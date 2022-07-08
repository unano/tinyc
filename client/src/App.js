import React, { lazy, Suspense } from "react";
// import LoginRegister from "./pages/loginRegister";
// import Chat from "./pages/chats";
// import User from "./pages/user";
// import Friends from "./pages/friends";
// import NewGroup from "./pages/newGroup";
// import Groupchats from "./pages/grounds";
// import UserUser from "./components/userUsers";
// import UserChats from "./components/userChats";
// import ChatApplication from "./pages/chatManage";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import AuthProvider from "./contexts/authContext";
import SettingProvider from "./contexts/settingContext";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/errorBoundary";
import "./App.css";
import LazyWait from "./components/lazyWait"
const LoginRegister = lazy(() => import("./pages/loginRegister"));
const Chat = lazy(() => import("./pages/chats"));
const User = lazy(() => import("./pages/user"));
const Friends = lazy(() => import("./pages/friends"));
const NewGroup = lazy(() => import("./pages/newGroup"));
const Groupchats = lazy(() => import("./pages/grounds"));
const UserUser = lazy(() => import("./components/userUsers"));
const UserChats = lazy(() => import("./components/userChats"));
const ChatApplication = lazy(() => import("./pages/chatManage"));

function App() {
  const location = useLocation();
  return (
    // <TransitionGroup>
    //   <CSSTransition timeout={300} classNames="fadeRoute" key={location.key}>
    <Suspense fallback={<LazyWait/>}>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
        <AuthProvider>
          <SettingProvider>
            <Routes location={location}>
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/home" element={<Chat />} />
              <Route path="/friend" element={<Friends />} />
              <Route path="/user" element={<User />}>
                <Route path="users" element={<UserUser />} />
                <Route path="chats" element={<UserChats />} />
                <Route path="/user" element={<Navigate replace to="users" />} />
              </Route>
              <Route path="/newGroup" element={<NewGroup />} />
              <Route path="/ground" element={<Groupchats />} />
              <Route path="/chat/:id" element={<ChatApplication />} />
              <Route path="/" element={<Navigate replace to="/login" />} />
            </Routes>
          </SettingProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Suspense>
    // </CSSTransition>
    //</TransitionGroup>
  );
}

export default App;
