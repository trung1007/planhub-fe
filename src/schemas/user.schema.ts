import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullName: z.string().nonempty("Vui lòng nhập họ và tên"),
    username: z.string().nonempty("Vui lòng nhập tên đăng nhập"),
    email: z
      .string()
      .nonempty("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    phoneNumber: z.string().optional(),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  account: z.string().min(1, "Vui lòng nhập email hoặc username"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const CreateUserSchema = z
  .object({
    createdUserId: z.number().nullable(),
    fullName: z.string().nonempty("Vui lòng nhập họ và tên"),
    username: z.string().nonempty("Vui lòng nhập tên đăng nhập"),
    email: z
      .string()
      .nonempty("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    phoneNumber: z.string().optional(),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const EditUserSchema = z.object({
  fullName: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  updatedUserId: z.number().nullable(),
});



export type RegisterInput = z.infer<typeof RegisterSchema>;

export type LoginInput = z.infer<typeof LoginSchema>;

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type EditUserInput = z.infer<typeof EditUserSchema>;
