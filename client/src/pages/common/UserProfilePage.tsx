import { useState } from "react";
import {
  ErrorAlert,
  InputBox,
  LoadingSpinner,
  PasswordBox,
  SuccessAlert,
} from "@/components/common";
import { useAuth } from "@/hooks";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCircleIcon,
  ShieldCheckIcon,
  CalendarIcon,
  KeyIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/utils/helpers";

const FormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserProfileFormData = z.infer<typeof FormSchema>;

function UserProfilePage() {
  const {
    user,
    updateUser,
    updatePassword,
    error: { updatingUser: updateError },
    loading: { updatingUser },
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const [editingField, setEditingField] = useState<"name" | "email" | null>(
    null
  );
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEdit = (field: "name" | "email") => {
    setEditingField(field);
    setLocalError(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    reset();
    setLocalError(null);
  };

  const handleSave = async (field: "name" | "email", value: string) => {
    if (!user) return;

    try {
      const updateData = {
        ...user,
        [field]: value,
      };

      await updateUser(updateData);
      setEditingField(null);
      setSuccessMessage(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully!`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setLocalError("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (formData: UserProfileFormData) => {
    if (!formData.currentPassword || !formData.newPassword) return;

    try {
      const passwordChanged = await updatePassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (passwordChanged) {
        setShowPasswordFields(false);
        setSuccessMessage("Password updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        reset();
      }
    } catch {
      setLocalError("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl text-blue-700 font-bold mb-8">Your Profile</h2>

      {/* User Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <UserCircleIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Account Type
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 capitalize">
                {user?.role}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Verification Status
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {user?.isVerified ? "Verified" : "Unverified"}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Member Since
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {user?.createdAt
                  ? formatDate(user.createdAt.toString()).split(",")[0]
                  : "N/A"}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <KeyIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Password Status
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {user?.resetPasswordToken ? "Reset Pending" : "Active"}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
        {(updateError || localError) && (
          <ErrorAlert
            title="Error Updating User!"
            subtitle={updateError || localError}
          />
        )}

        {successMessage && (
          <SuccessAlert
            title="Successfully updated profile!"
            subtitle={successMessage}
          />
        )}

        <EditableDetailItem fieldName="name" placeholder="Your Name" />
        <EditableDetailItem fieldName="email" placeholder="Your Email" />

        {/* Password Section */}
        <div className="p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Password</h3>
            <button
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {showPasswordFields ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordFields && (
            <form
              onSubmit={handleSubmit(handlePasswordChange)}
              className="space-y-4"
            >
              <PasswordBox
                id="currentPassword"
                placeholder="Current Password"
                disabled={updatingUser}
                {...register("currentPassword")}
                error={errors.currentPassword?.message}
              />
              <PasswordBox
                id="newPassword"
                placeholder="New Password"
                disabled={updatingUser}
                {...register("newPassword")}
                error={errors.newPassword?.message}
              />
              <PasswordBox
                id="confirmPassword"
                placeholder="Confirm Password"
                disabled={updatingUser}
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updatingUser}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                >
                  {updatingUser ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  type propTypes = {
    fieldName: "name" | "email";
    placeholder: string;
  };

  function EditableDetailItem(props: propTypes) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 flex gap-2">
          <InputBox
            id={props.fieldName}
            placeholder={props.placeholder}
            {...register(props.fieldName)}
            disabled={updatingUser || editingField !== props.fieldName}
          />
          {editingField === props.fieldName ? (
            <>
              <button
                type="button"
                onClick={() =>
                  handleSave(props.fieldName, getValues(props.fieldName))
                }
                className="p-2 w-10 h-10 text-center text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors"
                disabled={updatingUser}
              >
                <CheckIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 pl-2.5 w-10 h-10 text-center text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                disabled={updatingUser}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleEdit(props.fieldName)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default UserProfilePage;
