import UsersTable from "@/components/table/UsersTable";

const ReleasePage = () => {
    return (
        <div className="bg-white h-full w-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 border-b p-3">Team member</h3>
            <UsersTable />
        </div>
    )
};

export default ReleasePage;