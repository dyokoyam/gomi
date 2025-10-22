import { z } from "zod";

export const IsoDateString = z
  .string()
  .refine((v: string) => !Number.isNaN(Date.parse(v)), { message: "Invalid ISO date string" });

export const OptionalIsoDate = z.union([IsoDateString, z.date()]).optional();

export function toIso(input: string | Date | undefined | null): string | undefined {
  if (!input) return undefined;
  if (input instanceof Date) return input.toISOString();
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function genId(prefix = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}


