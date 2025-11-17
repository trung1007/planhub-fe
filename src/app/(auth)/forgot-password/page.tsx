"use client";

import { useForm } from "react-hook-form";
import { FaRocket } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Forgot password data:", data);

    // Gọi API gửi email reset mật khẩu tại đây
    // const res = await fetch("/api/forgot-password", {...})
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
          {/* Email */}
          <input
            type="email"
            placeholder="Your email address"
            className="w-full border p-2 rounded focus:outline-blue-500"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message as string}</p>
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
              Remember password?{" "}
              <span className="text-second font-medium hover:underline hover:text-primary transition-all">
                Log in
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-second text-white p-2 rounded hover:bg-primary"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
