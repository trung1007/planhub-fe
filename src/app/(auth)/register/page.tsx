"use client";

import { useForm } from "react-hook-form";
import { FaRocket } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RegisterInput, RegisterSchema } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const { mutate, isPending } = useRegister();

  const onSubmit = (data: RegisterInput) => {
    console.log("registerData:", data);

    mutate(data, {
      onSuccess: () => {
        toast.success("Đăng ký thành công");
        router.push("/login");
      },
      onError: (error: any) => {
        toast.error("Đăng ký thất bại:", error?.message);
      },
    });
  };

  // Lấy password để validate confirmPassword
  const passwordValue = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="w-[350px] bg-white p-8 shadow-md border rounded">
        {/* Logo */}
        <div className="text-center mb-6 flex justify-center gap-2">
          <h1 className="text-3xl font-bold">
            <span className="text-second">Plan</span>
            <span className="text-black-800">Hub</span>
          </h1>
          <div className="text-second text-4xl">
            <FaRocket />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded focus:outline-blue-500"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Username"
              className="w-full border p-2 rounded focus:outline-blue-500"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          {/* Username */}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded focus:outline-blue-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              className="w-full border p-2 rounded focus:outline-blue-500"
              {...register("phoneNumber")}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded focus:outline-blue-500"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded focus:outline-blue-500"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <div className="text-sm flex flex-col gap-2">
              <span className="text-gray-500">
                Already have an account?{" "}
                <span
                  className="text-second font-medium hover:underline hover:text-primary transition-all cursor-pointer"
                  onClick={() => router.push("/login")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      router.push("/login");
                  }}
                >
                  Log in
                </span>
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-second text-white p-2 rounded hover:bg-primary"
            >
              {isSubmitting ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
