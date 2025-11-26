"use client";

import { useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { Button } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import ButtonGroup from "../ButtonGroupTable";

interface SubTask {
    id: number;
    code: string;
    summary: string;
    assignee: string;
    status: string;
}

const SubTaskTable = ({ data }: { data: SubTask[] }) => {
    const limit = 10;
    const [page, setPage] = useState(1);

    // Giống ReleaseTable nhưng đổi tên cột
    const columns: ColumnsType<any> = [
        {
            title: "No",
            key: "no",
            align: "center",
            width: 60,
            fixed: "left" as const,
            render: (_: any, __: any, index: number) =>
                (page - 1) * limit + index + 1,
        },
        {
            title: "Sub-task Code",
            dataIndex: "code",
            key: "code",
            ellipsis: true,
            width: 120,
        },
        {
            title: "Summary",
            dataIndex: "summary",
            key: "summary",
            ellipsis: true,
            width: 250,
        },
        {
            title: "Assignee",
            dataIndex: "assignee",
            key: "assignee",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            ellipsis: true,
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            fixed: "right" as const,
            render: () => (
                <div className="flex gap-1">
                    <Button size="small" type="primary">
                        <FaEdit />
                    </Button>
                    <Button danger size="small">
                        <FaTrash />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-3 flex flex-col gap-2">
            <ButtonGroup onAdd={() => {}} title="Add sub-task" />
            <Table
                rowKey="id"
                className="custom-table"
                columns={columns}
                dataSource={data}
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: data.length,
                    onChange: (p) => setPage(p),
                }}
                scroll={{ x: "100%" }}
                tableLayout="fixed"
            />
        </div>
    );
};

export default SubTaskTable;
