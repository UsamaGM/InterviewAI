import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const UserProfilePage = lazy(() => import("../pages/common/UserProfilePage"));

export default function SharedRoutes() {
  const { isAuthenticated } = useAuth();
  console.log("SharedRoutes", isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  return (
    <Routes>
      <Route path="profile" element={<UserProfilePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
