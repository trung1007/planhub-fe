import ReleaseTable from "@/components/table/ReleaseTable";


const ReleasePage = () => {
    return (
        <div className="bg-white h-full w-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 border-b p-3">Release</h3>
            <ReleaseTable />
        </div>
    )
};

export default ReleasePage;