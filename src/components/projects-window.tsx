"use client";

const projects = [
  {
    name: "Coming soon",
    description: "Projects will be listed here.",
  },
];

export default function ProjectsWindow() {
  return (
    <div className="p-4 font-mono text-sm space-y-4">
      <div className="text-accent font-bold">Projects</div>
      {projects.map((project) => (
        <div key={project.name}>
          <div className="text-text">{project.name}</div>
          <div className="text-muted text-xs">{project.description}</div>
        </div>
      ))}
    </div>
  );
}
