import TeamMemberTable from "@/components/table/TeamMemberTable";

const TeamPage = () => {
    return (
        <div className="bg-white h-full w-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 border-b p-3">Team member</h3>
            <div className="overflow-x-auto">
                <TeamMemberTable />
            </div>
        </div>
    )
};

export default TeamPage;