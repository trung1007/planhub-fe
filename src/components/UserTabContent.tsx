"use client";
import { useState } from "react";
import { Table } from "antd";
import { useAllUser } from "@/hooks/useUser";

const UserTabContent = () => {
    const [page, setPage] = useState(1);
    const limit = 5;

    const { data, isLoading } = useAllUser(page, limit);

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
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
    ];

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 border-b p-3">User Settings</h3>

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
    );
};

export default UserTabContent;
