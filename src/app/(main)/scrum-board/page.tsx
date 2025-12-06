import BoardTable from "@/components/table/BoardTable";


const ScrumBoardPage = () => {
    return (
        <div className="bg-white h-full w-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 border-b p-3">Scrum board</h3>
            <BoardTable />
        </div>
    )
};

export default ScrumBoardPage;