import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
  memo,
} from "react";
import { ErrorAlert, InputBox, LoadingSpinner } from "@/components/common";
import { useAuth } from "@/hooks";

function UserProfilePage() {
  const {
    user,
    updateUser,
    error: { updatingUser: updateError },
    loading: { updatingUser },
  } = useAuth();

  console.log(user);

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
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Reset password fields when toggling password section
  useEffect(() => {
    if (!showPasswordFields) {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setPasswordError(null);
    }
  }, [showPasswordFields]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { id, value } = event.target;
      setFormData((prev) => ({ ...prev, [id]: value }));

      if (passwordError && id === "password") {
        setPasswordError(null);
      }
    },
    [passwordError]
  );

  const toggleDisabled = useCallback((id: "email" | "name" | "password") => {
    setDisabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (showPasswordFields) {
        if (formData.newPassword.length < 8) {
          setPasswordError("Password must be 8 characters long!");
        } else if (formData.newPassword !== formData.confirmPassword) {
          setPasswordError("Passwords do not match!");
        } else if (!formData.currentPassword) {
          setPasswordError("Current password is required!");
        }
      }

      if (user) {
        const updateData = {
          ...user,
          name: formData.name,
          email: formData.email,
          ...(showPasswordFields && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        };

        await updateUser(updateData);

        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setSuccessMessage("Profile updated successfully!");
        setShowPasswordFields(false);
      }
    },
    [formData, showPasswordFields, user, updateUser]
  );

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
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          showToggle
          id="email"
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          disabled={disabled.email}
          onChange={handleChange}
          onToggle={() => toggleDisabled("email")}
        />
        <FormInput
          showToggle
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          disabled={disabled.name}
          onChange={handleChange}
          onToggle={() => toggleDisabled("name")}
        />

        <div className="relative pt-2 flex justify-center">
          <div className="absolute left-0 w-full top-1/2 translate-y-1/2 h-0.5 rounded-full bg-blue-200" />
          <button
            type="button"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="text-blue-500 z-50 bg-white hover:bg-blue-100 hover:text-blue-800 px-4 py-2 cursor-pointer rounded-md text-sm font-medium  focus:outline-none"
          >
            {showPasswordFields ? "Cancel Password Change" : "Change Password"}
          </button>
        </div>

        {showPasswordFields && (
          <div className="space-y-6 pt-2 pb-2">
            {passwordError && (
              <ErrorAlert title="Password Error!" subtitle={passwordError} />
            )}

            <FormInput
              showToggle={false}
              id="currentPassword"
              name="password"
              type="password"
              placeholder="Current Password"
              value={formData.currentPassword}
              disabled={false}
              onChange={handleChange}
            />
            <FormInput
              showToggle={false}
              id="newPassword"
              name="password"
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              disabled={false}
              onChange={handleChange}
            />
            <FormInput
              showToggle={false}
              id="confirmPassword"
              name="password"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              disabled={false}
              onChange={handleChange}
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
    </div>
  );
}

type FormInputProps = {
  showToggle: boolean;
  id: "name" | "email" | "currentPassword" | "newPassword" | "confirmPassword";
  name: "name" | "email" | "password";
  type: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onToggle?: () => void;
};

const FormInput = memo(
  ({
    showToggle = false,
    id,
    name,
    type,
    placeholder,
    value,
    disabled,
    onChange,
    onToggle,
  }: FormInputProps) => {
    return (
      <div className="flex w-full">
        <InputBox
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={!disabled}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="w-20 ml-2 px-4 py-2 text-sm bg-blue-100 text-blue-600 hover:bg-blue-300 hover:text-blue-800 rounded-md"
          >
            {disabled ? "Change" : "Cancel"}
          </button>
        )}
      </div>
    );
  }
);

export default UserProfilePage;
