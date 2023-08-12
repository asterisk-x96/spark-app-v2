import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import UserProfile from '../pages/UserProfile';
import DashboardLayout from '../layouts/dashboard';
import FriendsPage from '../pages/FriendsPage';
import UserFundPage from '../pages/UserFund';
import Page404 from '../pages/Page404';
import GoalPage from '../pages/GoalPage';
import DashboardAppPage from '../pages/DashboardAppPage';
import NewGoalPage from '../pages/NewGoalPage';
import GoalCreated from '../sections/@dashboard/goals/GoalCreated';
import RegisterPage from '../pages/RegisterPage';
import TestData from '../pages/TestData';
import UpdateProfile from '../sections/profile/UpdateProfile';
import EditGoal from '../sections/@dashboard/goals/EditGoal';
import PrivateRoute from './PrivateRoute';
import ResetPasswordPage from '../sections/auth/ResetPassword';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<PrivateRoute component={DashboardAppPage} />} />
        <Route path="dashboard" element={<PrivateRoute component={DashboardAppPage} />} />
        <Route path="friends" element={<PrivateRoute component={FriendsPage} />} />
        <Route path="goals" element={<PrivateRoute component={GoalPage} />} />
        <Route path="my-fund" element={<PrivateRoute component={UserFundPage} />} />
        <Route path="create" element={<PrivateRoute component={NewGoalPage} />} />
        <Route path="profile" element={<PrivateRoute component={UpdateProfile} />} />
        <Route path="reset-password" element={<PrivateRoute component={ResetPasswordPage} />} />
        <Route path="user/:username" element={<PrivateRoute component={UserProfile} />} />
        <Route path="goal/:goalId" element={<PrivateRoute component={GoalCreated} />} />
        <Route path="edit/:goalId" element={<PrivateRoute component={EditGoal} />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="test" element={<TestData />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
