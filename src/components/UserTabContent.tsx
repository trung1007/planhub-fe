"use client";
import { useState } from "react";
import { Button, Popconfirm, Table } from "antd";
import { useAllUser } from "@/hooks/useUser";
import AddUserModal from "./modal/AddUserModal";
import { ColumnsType } from "antd/es/table";
import EditUserModal from "./modal/EditUserModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTabContent = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useAllUser(page, limit);
  const [openAdd, setOpenAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleEdit = (record: any) => {
    setSelectedUser(record);
    setOpenEdit(true);
  };


  const handleDelete = (record: any) => {
    console.log("Delete user:", record);
    // gọi API xóa user
  };


  const columns: ColumnsType<any> = [
    {
      title: "No",
      key: "no",
      align: "center",
      width: 60,
      fixed: "left" as const,
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
    },

    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      width: 120,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ellipsis: true,
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      width: 180,
      render: (value: string) => (
        <span className="email-ellipsis">{value}</span>
      ),
    },

    {
      title: "Created",
      dataIndex: "createdBy",
      key: "createdBy",
      align: "center",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Updated",
      dataIndex: "updatedBy",
      key: "updatedBy",
      align: "center",
      ellipsis: true,
      width: 150,
    },

    {
      title: "Action",
      key: "action",
      width: 120,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <div className="flex gap-1">
          <Button size="small" type="primary" onClick={() => handleEdit(record)}>
            <FaEdit />
          </Button>
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small"><FaTrash /></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];



  return (
    <div className="h-full w-full">
      <h3 className="text-xl font-semibold mb-4 border-b p-3">Users</h3>
      <div className="p-3 flex flex-col gap-2">
        <ButtonGroup onAdd={() => setOpenAdd(true)} />
        {/* <div className="w-full">
          
        </div> */}

        <Table
          rowKey="id"
          className="custom-table"
          columns={columns}
          dataSource={data?.items || []}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.total || 0,
            onChange: (p) => setPage(p),
          }}
          onRow={() => ({
            style: { cursor: "pointer" },
          })}
          scroll={{ x: "100%" }}
          tableLayout="fixed"
        />

      </div>
      {openAdd && <AddUserModal openAdd={openAdd} setOpenAdd={setOpenAdd} />}
      {openEdit && (
        <EditUserModal open={openEdit} setOpen={setOpenEdit} user={selectedUser} />
      )}
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
