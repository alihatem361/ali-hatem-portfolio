import ProjectDetail from "../../../src/views/ProjectDetail";

export const metadata = {
  title: "Project Details",
  description:
    "Detailed view of a Flutter mobile application project by Abdulrahman Hatem.",
};

export default async function ProjectDetailPage({ params }) {
  const { projectId } = await params;

  return <ProjectDetail projectId={decodeURIComponent(projectId)} />;
}
