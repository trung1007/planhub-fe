import ActionWorkflowPage from "../ActionWorkflowPage";

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    return <ActionWorkflowPage id={id} />;
}
