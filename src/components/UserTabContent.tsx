"use client";
import { useState } from "react";
import { Button, Input, Modal, Popconfirm, Table } from "antd";
import { useAllUser } from "@/hooks/useUser";
import { RegisterInput, RegisterSchema } from "@/schemas/user.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddUserModal from "./modal/AddUserModal";

const UserTabContent = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useAllUser(page, limit);
  const [openAdd, setOpenAdd] = useState(false);

  //   const [formData, setFormData] = useState({
  //     username: "",
  //     fullName: "",
  //     email: "",
  //     phoneNumber: "",
  //     password: "",
  //   });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleEdit = (record: any) => {
    console.log("Edit user:", record);
    // mở modal edit hoặc chuyển sang trang edit
  };

  const handleDelete = (record: any) => {
    console.log("Delete user:", record);
    // gọi API xóa user
  };
  const columns = [
    {
      title: "No",
      key: "no",
      render: (_: any, __: any, index: number) => {
        return (page - 1) * limit + index + 1;
      },
      width: 80,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Action",
      key: "action",
      width: 180,
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 border-b p-3">Users</h3>
      <div className="p-3 flex flex-col gap-2">
        <ButtonGroup onAdd={() => setOpenAdd(true)} />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data?.items || []}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.total || 0,
            onChange: (p) => setPage(p),
          }}
        />
      </div>
      {openAdd && <AddUserModal openAdd={openAdd} setOpenAdd={setOpenAdd} />}
    </div>
  );
};

const ButtonGroup = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="flex py-3 justify-between">
      <button
        onClick={onAdd}
        className="px-3 bg-primary text-white transition font-semibold duration-300 hover:scale-110 cursor-pointer origin-center"
      >
        Add an user
      </button>
      <div className="flex gap-3">
        <button className="px-3 bg-primary font-semibold text-white ">
          Filter
        </button>
        <button className="px-3 bg-primary font-semibold text-white ">
          Sort By
        </button>
        <button className="px-3 bg-primary font-semibold text-white ">
          View
        </button>
      </div>
    </div>
  );
};

export default UserTabContent;
