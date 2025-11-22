"use client";
import UsersTable from "./table/UsersTable";

const UserTabContent = () => {
  return (
    <div className="h-full w-full">
      <h3 className="text-xl font-semibold mb-4 border-b p-3">Users</h3>
      <UsersTable />
    </div>
  );
};

export default UserTabContent;
