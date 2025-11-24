import SprintTable from "@/components/table/SprintTable";


const ReleasePage = () => {
    return (
        <div className="bg-white h-full w-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 border-b p-3">Srpint</h3>
            <SprintTable />
        </div>
    )
};

export default ReleasePage;