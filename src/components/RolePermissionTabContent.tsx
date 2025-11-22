"use client";
import { FaArrowLeftLong } from "react-icons/fa6";

import PermissionTable from "./table/PermissionTable";
import RolePermissionsTable from "./table/RolePermissionsTable";

const RolePermissionTabContent = ({ role, onBack }: any) => {
    if (!role) return <div className="p-4">No role selected</div>;

    return (
        <div className="h-full w-full">
            {/* Header */}
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-4 border-b p-3">
                <button onClick={onBack}>
                    <FaArrowLeftLong />
                </button>
                {role.name}
            </h3>

            <RolePermissionsTable role={role} />
            <PermissionTable role={role} />
        </div>
    );
};

export default RolePermissionTabContent;
