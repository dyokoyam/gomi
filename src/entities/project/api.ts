"use client";

import type { Project } from "./model";
import { sampleProjects } from "@/mocks/projects";

const PROJECTS_KEY = "educationMaterialProjects";
const SHOULD_SEED = process.env.NEXT_PUBLIC_SEED_PROJECTS === "true";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function seedIfEmpty() {
  if (!isBrowser()) return;
  if (!SHOULD_SEED) return;
  const saved = localStorage.getItem(PROJECTS_KEY);
  if (saved) return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(sampleProjects));
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


