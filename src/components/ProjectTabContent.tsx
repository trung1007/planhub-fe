"use client";

import ProjectTable from "./table/ProjectTable";


const ProjectTabContent = () => {
  return (
    <div className="h-full w-full">
      <h3 className="text-xl font-semibold mb-4 border-b p-3">Projects</h3>
      <ProjectTable />
    </div>
  );
};

export default ProjectTabContent;
