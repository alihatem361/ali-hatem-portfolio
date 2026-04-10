import ProjectDetail from "../../../src/views/ProjectDetail";

export const metadata = {
  title: "Project Details | ali hatem ramadan",
  description: "Project details page for ali hatem ramadan portfolio.",
};

export default async function ProjectDetailPage({ params }) {
  const { projectId } = await params;

  return <ProjectDetail projectId={decodeURIComponent(projectId)} />;
}
