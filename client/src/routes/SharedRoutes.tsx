import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const UserProfilePage = lazy(() => import("../pages/common/UserProfilePage"));

interface props {
  isAuthenticated: boolean;
}

export const SharedRoutes = ({ isAuthenticated }: props) => {
  console.log("SharedRoutes", isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  return (
    <Routes>
      <Route path="profile" element={<UserProfilePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
