import WorkflowTable from "@/components/table/WorkflowTable";

const WorkflowPage = () => {
    return (
        <div className="bg-white h-full w-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 border-b p-3">Workflow</h3>
            <WorkflowTable />
        </div>
    )
};

export default WorkflowPage;