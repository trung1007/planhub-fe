import IssueTable from "@/components/table/IssueTable";


const IssuePage=()=> {
  return (
    <div className="bg-white h-full w-full flex flex-col ">
      <h3 className="text-xl font-semibold mb-4 border-b p-3">Issue</h3>
      <div className="w-full ">
        <IssueTable />
      </div>
    </div>
  );
}


export default IssuePage