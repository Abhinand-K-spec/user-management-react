import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserLogin } from "./pages/userLogin";
import { UserRegister } from "./pages/userRegister";
import { UserHome } from "./pages/userHome";
import { UserProfile } from "./pages/userProfile";
import { AdminDashboard } from "./pages/adminDashboard";

import { ProtectedRoute, UnauthRoute } from "./routes/protectedRoutes.jsx";

const App = () => {
  return (
    <Router>
      <Routes>

        <Route element={<UnauthRoute />}>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<UserHome />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;