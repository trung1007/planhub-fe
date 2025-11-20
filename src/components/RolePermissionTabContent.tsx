"use client";

import { useAllPermissionIds, useAllPermissions } from "@/hooks/useRole";
import { Checkbox } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

const RolePermissionTabContent = ({ role, onBack }: any) => {

    const [page, setPage] = useState(1);
    const limit = 5;

    const { data, isLoading } = useAllPermissions(page, limit);

    const {
        data: allIdsData,
        refetch: fetchAllIds,
    } = useAllPermissionIds();

    // lưu danh sách permission đã chọn
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // chọn tất cả
    const handleSelectAll = async (checked: boolean) => {
        if (!checked) {
            setSelectedIds([]);
            return;
        }

        // 🔥 Gọi API lấy toàn bộ permission IDs
        const result = await fetchAllIds();

        const ids = result.data?.ids || [];
        setSelectedIds(ids);
    };
    // chọn từng dòng
    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) setSelectedIds((prev) => [...prev, id]);
        else setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const allIds = allIdsData?.ids || [];

    const columns: ColumnsType<any> = [
        // 🟩 CHECKBOX COLUMN
        {
            title: (
                <Checkbox
                    checked={allIds.length > 0 && selectedIds.length === allIds.length}
                    indeterminate={
                        selectedIds.length > 0 && selectedIds.length < allIds.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
            ),
            key: "checkbox",
            width: 50,
            align: "center",
            render: (_: any, record: any) => (
                <Checkbox
                    checked={selectedIds.includes(record.id)}
                    onChange={(e) => handleSelectOne(record.id, e.target.checked)}
                />
            ),
        },

        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
            ellipsis: true,
            width: 200,
            render: (value: string) => (
                <span className="code-ellipsis">{value}</span>
            ),
        },
        {
            title: "Method",
            dataIndex: "method",
            key: "method",
            align: "center",
            width: 100,
        },
        {
            title: "URL",
            dataIndex: "url",
            key: "url",
            ellipsis: true,
            width: 300,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            width: 200,
        },
    ];

    if (!role) return <div className="p-4">No role selected</div>;

    return (
        <div className="h-full w-full">
            <h3 className=" flex items-center gap-3 flex-1 text-xl font-semibold mb-4 border-b p-3"> <button onClick={onBack}><FaArrowLeftLong /></button>{role.name}</h3>
            <div className="p-3 flex flex-col gap-2">
                <div className="flex flex-col">
                    <h2 className="font-semibold">All permissions</h2>
                    <ButtonGroup onAdd={() => console.log("Add", selectedIds)} nums={selectedIds.length} />
                </div>

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
        </div>

    );
};

export default RolePermissionTabContent;


const ButtonGroup = ({ onAdd, nums }: { onAdd: () => void, nums: number }) => {
    return (
        <div className="flex py-3 justify-between">
            <button
                onClick={onAdd}
                className="px-3 bg-primary text-white transition font-semibold duration-300 hover:scale-110 cursor-pointer origin-center"
            >
                {nums > 0 ? `Add ${nums} permissions to this role ` : "Add to this role"}
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