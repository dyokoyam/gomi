import type { Project } from "@/entities/project/model";

export const sampleProjects: Project[] = [
  { name: "サンプルプロジェクト1", createdAt: new Date("2024-01-15").toISOString(), status: "completed", slideCount: 15, template: "business" },
  { name: "サンプルプロジェクト2", createdAt: new Date("2024-02-10").toISOString(), status: "completed", slideCount: 20, template: "education" },
];


