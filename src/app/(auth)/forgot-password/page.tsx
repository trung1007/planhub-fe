"use client";

import { useForm } from "react-hook-form";
import { FaRocket } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useForgotPassword, useResetPassword } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get("token");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },

  } = useForm();

  const { mutate, isPending } = useForgotPassword();

  const { mutate: resetMutate, isPending: isResetPending } = useResetPassword();

  const onSubmit = async (data: any) => {
    if (!resetPasswordToken) {
      mutate({ email: data.email }, {
        onSuccess: () => {
          toast.success("Reset link has been sent to your email");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Something went wrong");
        },
      });
    }
    else {
      resetMutate(
        { token: resetPasswordToken, newPassword: data.password },
        {
          onSuccess: () => {
            toast.success("Password has been reset successfully");
            router.push("/login");
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Something went wrong");
          },
        }
      );
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="w-[350px] bg-white p-8 shadow-md border rounded">
        {/* Logo & Title */}
        <div className="text-center mb-6 flex justify-center gap-2">
          <h1 className="text-3xl font-bold">
            <span className="text-second">Plan</span>
            <span className="text-black-800">Hub</span>
          </h1>
          <div className="text-second text-4xl">
            <FaRocket />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input - chỉ hiện khi không có token */}
          {!resetPasswordToken && (
            <>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full border p-2 rounded focus:outline-blue-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message as string}</p>
              )}
            </>
          )}

          {/* New password input - chỉ hiện khi có token */}
          {resetPasswordToken && (
            <>
              <input
                type="password"
                placeholder="New password"
                className="w-full border p-2 rounded focus:outline-blue-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min length is 6" },
                })}
              />
              {errors.password?.message && (
                <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
              )}

              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full border p-2 rounded focus:outline-blue-500"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{String(errors.confirmPassword.message)}</p>
              )}
            </>
          )}

          <div className="flex flex-col items-start gap-4">
            <div
              className="text-sm text-gray-500 cursor-pointer"
              onClick={() => router.push("/login")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push("/login");
                }
              }}
            >
              {resetPasswordToken ? "Remember password? " : "Back to login? "}
              <span className="text-second font-medium hover:underline hover:text-primary transition-all">
                Log in
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="bg-second text-white p-2 rounded hover:bg-primary"
            >
              {(isSubmitting || isPending)
                ? "Sending..."
                : resetPasswordToken
                  ? "Reset Password"
                  : "Send reset link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default ForgotPasswordPage;
