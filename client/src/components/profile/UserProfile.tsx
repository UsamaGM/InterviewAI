import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { InputBox, LoadingSpinner } from "../common";
import useAuth from "../../hooks/useAuth";

function UserProfile() {
  const {
    user,
    updateUser,
    error: { updatingUser: updateError },
    loading: { initializing, updatingUser },
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState({
    name: true,
    email: true,
    password: true,
  });

  useEffect(() => {
    console.log("Rendered UserProfile");
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.id]: event.target.value });

    if (passwordError && event.target.id === "password") {
      setPasswordError(null);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (showPasswordFields) {
      if (formData.newPassword.length < 8) {
        setPasswordError("Password must be 8 characters long!");
        return;
      } else if (formData.newPassword !== formData.confirmPassword) {
        setPasswordError("Passwords do not match!");
        return;
      }
    }

    if (user) {
      const updateData = {
        ...user,
        name: formData.name,
        email: formData.email,
      };

      if (showPasswordFields) {
        updateData.password = formData.newPassword;
      }

      await updateUser(updateData);

      setFormData({
        email: user.email,
        name: user.name,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccessMessage("Profile updated successfully!");
    }
  }

  function toggleDisabled(id: "email" | "name" | "password") {
    setDisabled({ ...disabled, [id]: !disabled[id] });
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>

      {updateError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{updateError}</p>
        </div>
      )}

      {successMessage && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded"
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}

      {initializing ? (
        <LoadingSpinner size="lg" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            showToggle
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
          />
          <FormInput
            showToggle
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
          />

          <div className="relative pt-2 flex justify-center">
            <div className="absolute left-0 w-full top-1/2 translate-y-1/2 h-0.5 rounded-full bg-blue-200" />
            <button
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="text-blue-500 z-50 bg-white hover:bg-blue-100 hover:text-blue-800 px-4 py-2 cursor-pointer rounded-md text-sm font-medium  focus:outline-none"
            >
              {showPasswordFields
                ? "Cancel Password Change"
                : "Change Password"}
            </button>
          </div>

          {showPasswordFields && (
            <div className="space-y-4 pt-2 pb-2">
              {passwordError && (
                <div
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded"
                  role="alert"
                >
                  <p>{passwordError}</p>
                </div>
              )}

              <FormInput
                showToggle={false}
                id="currentPassword"
                name="password"
                type="password"
                placeholder="Current Password"
                value={formData.currentPassword}
              />
              <FormInput
                showToggle={false}
                id="newPassword"
                name="password"
                type="password"
                placeholder="New Password"
                value={formData.newPassword}
              />
              <FormInput
                showToggle={false}
                id="confirmPassword"
                name="password"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
              />
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={updatingUser}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
            >
              {updatingUser ? <LoadingSpinner size="sm" /> : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  interface FormInputProps {
    showToggle: boolean;
    id:
      | "name"
      | "email"
      | "currentPassword"
      | "newPassword"
      | "confirmPassword";
    name: "name" | "email" | "password";
    type: string;
    placeholder: string;
    value: string;
  }

  function FormInput({
    showToggle = false,
    id,
    name,
    type,
    placeholder,
    value,
  }: FormInputProps) {
    return (
      <div className="flex w-full">
        <InputBox
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={!disabled[name]}
          disabled={disabled[name]}
          value={value}
          onChange={handleChange}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => toggleDisabled(name)}
            className="ml-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 hover:text-blue-800 rounded-md"
          >
            {disabled[name] ? "Change" : "Cancel"}
          </button>
        )}
      </div>
    );
  }
}

export default UserProfile;
