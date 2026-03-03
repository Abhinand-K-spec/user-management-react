import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = () => {
  const { auth } = useSelector((state) => state.user);

  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export const UnauthRoute = () => {
  const { auth, role } = useSelector((state) => state.user);

  if (auth && role === "user") {
    return <Navigate to="/" replace />;
  }

  if (auth && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};