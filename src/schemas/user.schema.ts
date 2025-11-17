import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullName: z.string().min(1, "Vui lòng nhập họ và tên"),

    username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),

    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),

    phoneNumber: z.string().optional(),

    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  account: z.string().min(1, "Vui lòng nhập email hoặc username"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export type LoginInput = z.infer<typeof LoginSchema>;
