import React from "react";
import UserProfile from "../components/UserProfile";

const UserProfilePage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-xl">
        <h3 className="text-3xl font-semibold text-center mb-6">
          User Profile
        </h3>
        <UserProfile />
      </div>
    </div>
  );
};

export default UserProfilePage;
