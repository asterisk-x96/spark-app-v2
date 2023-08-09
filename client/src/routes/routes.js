import React from 'react';
import { Routes, Route } from 'react-router-dom';
// -----------------------------------------------
import UserProfile from '../pages/UserProfile';
import DashboardLayout from '../layouts/dashboard';
import BlogPage from '../pages/BlogPage';
import FriendsPage from '../pages/FriendsPage';
import LoginPage from '../pages/LoginPage';
import UserFundPage from '../pages/UserFund';
import Page404 from '../pages/Page404';
import GoalPage from '../pages/GoalPage';
import DashboardAppPage from '../pages/DashboardAppPage';
import NewGoalPage from '../pages/NewGoalPage';
import RegisterPage from '../pages/RegisterPage';
import WelcomePage from '../pages/WelcomePage';
import TestData from '../pages/TestData';
import UpdateProfile from '../sections/profile/UpdateProfile';
import ChatPage from '../pages/ChatPage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardAppPage />} />
        <Route path="dashboard" element={<DashboardAppPage />} />
        <Route path="friends" element={<FriendsPage />} />
        <Route path="goals" element={<GoalPage />} />
        <Route path="my-fund" element={ <UserFundPage /> } />
        <Route path="blog" element={<BlogPage />} />
        <Route path="create" element={<NewGoalPage />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="profile" element={<UpdateProfile />} />
        <Route path="user/:username" element={<UserProfile />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="test" element={<TestData />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}