"use client";

import { useAppSelector } from "@/hooks/reduxHook";
import {
  useChangePassword,
  useUpdateUser,
  useUserDetail,
} from "@/hooks/useUser";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UserPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePassword, setChangePassword] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading } = useUserDetail(user?.id ?? 0);

  const { mutate: updateUserMutate, isPending } = useUpdateUser();

  const { mutate: changePassword, isPending: isChanging } = useChangePassword();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    if (data) {
      reset({
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: any) => {
    if (!user) return;
    console.log("Saved:", data);
    if (isChangePassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (isChangePassword) {
      console.log("xử lý đổi mật khẩu");
      const payload: any = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      changePassword(
        { id: user.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Đổi mật khẩu thành công");
            setChangePassword(false);

            // clear field mật khẩu
            reset({
              ...formData,
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          },
          onError: (error) => {
            const axiosError = error as AxiosError<any>;
            const backendMessage = axiosError.response?.data?.message;
            let message = "Có lỗi xảy ra, vui lòng thử lại";

            if (Array.isArray(backendMessage)) {
              message = backendMessage.join("\n");
            } else if (typeof backendMessage === "string") {
              message = backendMessage;
            }

            toast.error(message);
            console.error("Change password error:", error);
          },
        }
      );
    }
    if (isEditing) {
      const payload: any = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      };

      updateUserMutate(
        { id: user.id, data: payload },
        {
          onSuccess: () => {
            // xử lý khi update thành công
            setIsEditing(false);
            setChangePassword(false);
            reset({
              ...formData,
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            toast.success("Cập nhật thông tin thành công");
          },
          onError: (error) => {
            const axiosError = error as AxiosError<any>;
            const backendMessage = axiosError.response?.data?.message;

            let message = "Có lỗi xảy ra, vui lòng thử lại";

            if (Array.isArray(backendMessage)) {
              message = backendMessage.join("\n");
            } else if (typeof backendMessage === "string") {
              message = backendMessage;
            }

            toast.error(message);
            console.error("Update user error:", error);
          },
        }
      );
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-md w-100 mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">User Detail</h2>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setChangePassword(false);
              setIsEditing(true);
            }}
            className="w-full py-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Chỉnh sửa thông tin
          </button>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* USER INFO */}
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              {...register("username")}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md transition
              ${
                isEditing
                  ? "bg-white border-blue-500"
                  : "bg-gray-200 border-gray-300"
              }
            `}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              {...register("email")}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md transition
              ${
                isEditing
                  ? "bg-white border-blue-500"
                  : "bg-gray-200 border-gray-300"
              }
            `}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              {...register("fullName")}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md transition
              ${
                isEditing
                  ? "bg-white border-blue-500"
                  : "bg-gray-200 border-gray-300"
              }
            `}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              {...register("phoneNumber")}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md transition
              ${
                isEditing
                  ? "bg-white border-blue-500"
                  : "bg-gray-200 border-gray-300"
              }
            `}
            />
          </div>

          {/* Nút đổi mật khẩu */}
          {!isChangePassword && (
            <button
              type="button"
              onClick={() => {
                setChangePassword(true);
                setIsEditing(false);
              }}
              className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md mt-2"
            >
              Đổi mật khẩu
            </button>
          )}

          {/* FORM ĐỔI MẬT KHẨU */}
          {isChangePassword && (
            <div className="space-y-3 mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">Đổi mật khẩu</h3>

              <div>
                <label className="block mb-1 font-medium">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  {...register("currentPassword")}
                  className="w-full px-3 py-2 border rounded-md bg-white border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Mật khẩu mới</label>
                <input
                  type="password"
                  {...register("newPassword")}
                  className="w-full px-3 py-2 border rounded-md bg-white border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-3 py-2 border rounded-md bg-white border-blue-500"
                />
              </div>

              {/* <button
                            type="button"
                            onClick={() => setChangePassword(false)}
                            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-md mt-2"
                        >
                            Hủy đổi mật khẩu
                        </button> */}
            </div>
          )}

          {/* Nút LƯU */}
          {(isEditing || isChangePassword) && (
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  if (isChangePassword) {
                    setChangePassword(false);
                  }
                  setIsEditing(false);
                  setChangePassword(false);
                  // Reset về giá trị ban đầu
                  if (data) {
                    reset({
                      username: data.username,
                      email: data.email,
                      fullName: data.fullName,
                      phoneNumber: data.phoneNumber,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }
                }}
                className="flex-1 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                Lưu
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserPage;
