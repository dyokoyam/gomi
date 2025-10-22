"use client";

import type { Project } from "./model";

const PROJECTS_KEY = "educationMaterialProjects";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function seedIfEmpty() {
  if (!isBrowser()) return;
  const saved = localStorage.getItem(PROJECTS_KEY);
  if (saved) return;
  const samples: Project[] = [
    { name: "サンプルプロジェクト1", createdAt: new Date("2024-01-15").toISOString(), status: "completed", slideCount: 15, template: "business" },
    { name: "サンプルプロジェクト2", createdAt: new Date("2024-02-10").toISOString(), status: "completed", slideCount: 20, template: "education" },
  ];
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(samples));
}

export function getProjects(): Project[] {
  if (!isBrowser()) return [];
  seedIfEmpty();
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Project[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function addProject(project: Project): Project[] {
  const list = getProjects();
  const next = [...list, project];
  saveProjects(next);
  return next;
}

export function updateProject(updated: Project): Project[] {
  const list = getProjects();
  const index = list.findIndex((p) => p === updated);
  if (index >= 0) {
    list[index] = updated;
  }
  saveProjects(list);
  return list;
}

export function deleteProjectByRef(target: Project): Project[] {
  const list = getProjects();
  const next = list.filter((p) => p !== target);
  saveProjects(next);
  return next;
}

export function searchByName(query: string): Project[] {
  const list = getProjects();
  const q = query.toLowerCase();
  return list.filter((p) => (p.name || "").toLowerCase().includes(q));
}


