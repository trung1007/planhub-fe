import { CreateUserInput, CreateUserSchema, RegisterInput, RegisterSchema } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import FormRow from "../FormRow";
import { useAddUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/reduxHook";
import { useEffect } from "react";

interface AddUserModalProps {
  openAdd: boolean;
  setOpenAdd: (value: boolean) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ openAdd, setOpenAdd }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      createdUserId: null,
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const currentUser = useAppSelector((state) => state.auth.user);

  const { mutate, isPending } = useAddUser();
  
  const handleSave = (data: CreateUserInput) => {
    if (currentUser) {
      data.createdUserId = currentUser.id;
      mutate(data, {
        onSuccess: () => {
          toast.success("Add User Successfully");
          setOpenAdd(false);
        },
        onError: (error: any) => {
          toast.error("Đăng ký thất bại:", error?.message);
        },
      });
    }
    else {
      console.error("Người dùng ko xác định");

    }

  };

  return (
    <Modal
      open={openAdd}
      footer={null}
      closable={false}
      width={500}
      className="custom-modal"
    >
      {/* HEADER */}
      <div className="bg-blue-100 px-4 py-2 flex justify-between items-center border-b">
        <span className="text-[16px] font-semibold">Add user</span>
        <button
          onClick={() => setOpenAdd(false)}
          className="text-gray-700 text-lg font-bold"
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <form
        onSubmit={handleSubmit(handleSave)}
        className="p-5 flex flex-col gap-4"
      >
        <FormRow label="Full Name" error={errors.fullName?.message}>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Full Name" />}
          />
        </FormRow>

        {/* Username */}
        <FormRow label="Username" error={errors.username?.message}>
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Username" />}
          />
        </FormRow>

        {/* Email */}
        <FormRow label="Email" error={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Email" />}
          />
        </FormRow>

        {/* Phone Number */}
        <FormRow label="Phone Number" error={errors.phoneNumber?.message}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Phone Number" />
            )}
          />
        </FormRow>

        {/* Password */}
        <FormRow label="Password" error={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Password" />
            )}
          />
        </FormRow>

        {/* Confirm Password */}
        <FormRow
          label="Confirm Password"
          error={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Confirm Password" />
            )}
          />
        </FormRow>
        <div className="flex justify-end gap-3 px-5 pb-4">
          <button
            onClick={() => setOpenAdd(false)}
            className="px-3 bg-blue-100 text-primary font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="px-3 bg-primary text-white font-semibold"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* FOOTER BUTTONS */}
    </Modal>
  );
};

export default AddUserModal;
