import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArtistAlbum(artist: string, title: string): string {
  return `${artist} — ${title}`;
}
