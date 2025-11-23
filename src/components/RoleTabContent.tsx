"use client";
import { useState } from "react";
import RolePermissionTabContent from "./RolePermissionTabContent";
import RolesTable from "./table/RolesTable";
const RoleTabContent = ({ roleScreen, setRoleScreen }: any) => {
    const [selectedRole, setSelectedRole] = useState<any>(null);
  
    if (roleScreen === "permission") {
        return (
            <RolePermissionTabContent
                role={selectedRole}
                onBack={() => setRoleScreen("list")}
            />

        );
    }

    return (
        <div className="h-full">
            <h3 className="text-xl font-semibold mb-4 border-b p-3">Role & Permission</h3>
            <RolesTable setRoleScreen={setRoleScreen} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>
        </div>
    );
};


export default RoleTabContent;
