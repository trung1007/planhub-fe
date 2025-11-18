"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRocket } from "react-icons/fa";
import { LoginInput, LoginSchema } from "@/schemas/user.schema";
import { useAuthMutation } from "@/hooks/useAuth";
import { loginUser } from "@/services/user.service";
import { toast } from "react-toastify";


const LoginPage = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const { mutate, isPending } = useAuthMutation(loginUser);

    const onSubmit = async (data: LoginInput) => {
        const isEmail = /\S+@\S+\.\S+/.test(data.account);
        const payload = isEmail
            ? { email: data.account, password: data.password }
            : { username: data.account, password: data.password };


        mutate(payload, {
            onSuccess: (res) => {
                router.push("/");
                toast.success("Login Successful");
            },
            onError: (error: any) => {
                const errorMessage =
                    error?.response?.data?.description || "Lỗi không xác định";
                console.log(errorMessage);

                toast.error(`Đăng nhập thất bại: ${errorMessage}`);
            },
        });
    };

    const goToForgotPassword = () => router.push("/forgot-password");
    const goToRegister = () => router.push("/register");

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <div className="w-[350px] bg-white p-8 shadow-md border rounded">
                {/* Logo */}
                <div className="text-center mb-6 flex justify-center gap-2">
                    <h1 className="text-3xl font-bold">
                        <span className="text-second">Plan</span>
                        <span className="text-black-800">Hub</span>
                    </h1>
                    <div className="text-second text-4xl"><FaRocket /></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Account */}
                    <input
                        type="text"
                        placeholder="Email hoặc Username"
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        {...register("account")}
                    />
                    {errors.account && (
                        <p className="text-red-500 text-sm">{errors.account.message}</p>
                    )}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}

                    {/* Submit & Links */}
                    <div className="flex justify-between">
                        <div className="text-sm cursor-pointer flex flex-col gap-2">
                            <span onClick={goToForgotPassword} className="hover:underline">Forgot password?</span>
                            <span className="text-gray-400">
                                Have no account?{" "}
                                <i className="text-second font-medium hover:underline hover:text-primary transition-all" onClick={goToRegister}>Register here</i>
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isPending}
                            className="bg-second text-white p-2 rounded hover:bg-primary"
                        >
                            {(isSubmitting || isPending) ? "Loading..." : "Log in"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
